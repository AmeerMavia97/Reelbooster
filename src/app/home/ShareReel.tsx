
"use client";
import { hideModal } from "@/app/store/Slice/ModalsSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import useApiPost from "@/app/hooks/postData";
import React, { useEffect, useRef, useState, useCallback } from "react";
import SearchInput from "../components/SearchInput";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { setUserId } from "@/app/store/Slice/UserIdHashtagIdSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FindUserRes, SendMessageRes, UserRecord } from "../types/ResTypes";
import { setReelSharedTrue } from "../store/Slice/handleCommentCount";
import CustomDialog from "../components/CustomDialog";

function ShareReel() {
  const open = useAppSelector((state) => state.modals.ShareReel);
  const dispatch = useAppDispatch();
  const { postData } = useApiPost();
  const router = useRouter();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);

  // Load Users
  const fetchUsers = async (
    pageNum: number = 1,
    append = false,
    search = ""
  ) => {
    if (!hasMore || (append && pageNum > totalPages)) return;

    if (!append) setIsLoading(true);
    else setIsLoadingNext(true);

    try {
      const res: FindUserRes = await postData("/users/find-user", {
        page: pageNum,
        user_name: search,
      });

      if (res?.status) {
        const records = (res.data?.Records || []).filter(
          (user: UserRecord) => user.user_name && user.user_name.trim() !== ""
        );
        const pages = res.data?.Pagination?.total_pages || 1;

        setUsers((prev) => (append ? [...prev, ...records] : records));
        setTotalPages(pages);
        setPage(pageNum);
        setHasMore(pageNum < pages && records.length > 0);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
      setIsLoadingNext(false);
    }
  };

  // Initial Fetch on Open
  useEffect(() => {
    const fetchInitialUsers = async () => {
      if (open && !initialLoadDone.current) {
        setUsers([]);
        setPage(1);
        setSearchText("");
        setHasMore(true);
        initialLoadDone.current = true;

        await fetchUsers(1, false, "");
      }
    };

    fetchInitialUsers();

    return () => {
      initialLoadDone.current = false;
    };
  }, [open]);

  // IntersectionObserver for infinite scroll
  const lastUserElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isLoadingNext) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && page < totalPages) {
            fetchUsers(page + 1, true, searchText);
          }
        },
        { threshold: 0.1 }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, isLoadingNext, hasMore, page, totalPages, searchText]
  );

  // Manual Search
  const handleSearch = async (text: string) => {
    const trimmed = text.trim();
    setSearchText(trimmed);
    setUsers([]);
    setPage(1);
    setHasMore(true);
    await fetchUsers(1, false, trimmed);
  };

  // Send Reel
  const socialId = useAppSelector((state) => state.selectedReel.ReelId);
  const handleSendReel = async (userId: number) => {
    try {
      const response: SendMessageRes = await postData("/chat/send-message", {
        user_id: userId,
        message_type: "social",
        social_id: socialId,
        message_content: "",
      });

      if (response.status) {
        toast.success("Reel sent successfully!");
        dispatch(setReelSharedTrue(socialId));
        dispatch(hideModal("ShareReel"));
      }
    } catch (error) {
      toast.error("Failed to send reel");
    }
  };

  // Navigate to User Profile
  const handleUserRoute = (userId: number) => {
    dispatch(setUserId(userId));
    dispatch(hideModal("ShareReel"));
    router.push(`/profile/${userId}`);
  };

  return (
    <CustomDialog open={open} onClose={() => dispatch(hideModal("ShareReel"))} title="Share Reel" width="420px">
      <div className="rounded-xl relative">
        <div className="pl-6 pt-4">
          <SearchInput placeholder="Search User" onSearch={handleSearch} />
        </div>

        {isLoading ? (
          <div className="flex justify-center h-[500px]">
            <ClipLoader color="#1A9D77" size={20} />
          </div>
        ) : (
          <div
            ref={containerRef}
            className="mt-4 h-[500px] overflow-y-auto px-6"
          >
            {users.length === 0 ? (
              <p className="text-sm text-center text-gray-500">
                No users found.
              </p>
            ) : (
              users.map((account, index) => (
                <div
                  key={account.user_id}
                  ref={index === users.length - 1 ? lastUserElementRef : null}
                  className="flex justify-between mb-4 items-center"
                >
                  <div
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => handleUserRoute(account.user_id)}
                  >
                    <div className="rounded-full w-[40px] h-[40px] overflow-hidden bg-gray-200">
                      <Image
                        src={account.profile_pic || "/default-avatar.png"}
                        alt={account.user_name}
                        className="w-full h-full object-cover"
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xs text-dark">{account.user_name}</h3>
                      <p className="text-[10px] text-dark/[0.4]">
                        {account.full_name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendReel(account.user_id)}
                    className="cursor-pointer text-[10px] font-normal rounded-xl w-16 py-1 bg-main-green text-primary"
                  >
                    Send
                  </button>
                </div>
              ))
            )}
            {isLoadingNext && (
              <div className="flex justify-center py-4">
                <ClipLoader color="#1A9D77" size={15} />
              </div>
            )}
          </div>
        )}
      </div>
    </CustomDialog>
  );
}

export default ShareReel;