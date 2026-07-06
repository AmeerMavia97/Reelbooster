"use client";
import { Dialog } from "@mui/material";
import { hideModal } from "@/app/store/Slice/ModalsSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import useApiPost from "@/app/hooks/postData";
import React, { useEffect, useRef, useState, useCallback } from "react";
import SearchInput from "../SearchInput";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { setUserId } from "@/app/store/Slice/UserIdHashtagIdSlice";
import { useRouter } from "next/navigation";
import {
  decrementFollowing,
  incrementFollowing,
} from "@/app/store/Slice/FollowFollowingCount";
import { triggerReelsRefresh } from "@/app/store/Slice/fetchFollowReelsSlice";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";

export interface UserRecord {
  user_id: number;
  user_name: string;
  profile_pic?: string;
  email?: string;
  full_name?: string;
  is_follow?: boolean;   // since you’re toggling follow/unfollow
}



function SearchAccountsPopup() {
  const open = useAppSelector((state) => state.modals.SearchAccounts);
  const dispatch = useAppDispatch();
  const { postData } = useApiPost();
  const router = useRouter();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [hasMore, setHasMore] = useState(true); // Added to track if more data is available

  const containerRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null); // For IntersectionObserver

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
      const res = await postData("/users/find-user-not-following", {
        page: pageNum,
        user_name: search,
      });

      if (res?.status) {
        const records = (res.data?.Records || []).filter(
          (user:UserRecord) => user.user_name && user.user_name.trim() !== ""
        ); // Filter out empty usernames
        const pages = res.data?.Pagination?.total_pages || 1;

        setUsers((prev) => (append ? [...prev, ...records] : records));
        setTotalPages(pages);
        setPage(pageNum);
        setHasMore(pageNum < pages && records.length > 0); // Update hasMore based on data
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
      setIsLoadingNext(false);
    }
  };

  // Initial Fetch on Open
  useEffect(() => {
    let cancelled = false;

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
      cancelled = true;
      initialLoadDone.current = false;
    };
  }, [open]);

  // IntersectionObserver for infinite scroll
  const lastUserElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoadingNext || isLoading) return;
      
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && page < totalPages) {
          fetchUsers(page + 1, true, searchText);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isLoadingNext, hasMore, page, totalPages, searchText]
  );

  // Manual search
  // Manual search
// ✅ called directly on every keystroke
const handleSearch = (text: string) => {
  const trimmed = text.trim();
  setSearchText(trimmed);

  // reset state
  setUsers([]);
  setPage(1);
  setHasMore(true);

  // 🔑 API call immediately
  if (trimmed.length > 0) {
    fetchUsers(1, false, trimmed);
  }
};



// Call API when searchText changes
useEffect(() => {
  if (open) {
    setUsers([]);
    setPage(1);
    setHasMore(true);
    fetchUsers(1, false, searchText);
  }
}, [searchText, open]);



  // Follow / Unfollow
  const handleFollowUnfollow = async (userId: number, isFollowed: boolean) => {
    try {
      const res = await postData("/follow/follow-unfollow", {
        user_id: userId,
      });

      if (res.status) {
        toast.success(res.message);
        setUsers((prev) =>
          prev.map((user) =>
            user.user_id === userId ? { ...user, is_follow: !isFollowed } : user
          )
        );

        dispatch(isFollowed ? decrementFollowing() : incrementFollowing());
        dispatch(triggerReelsRefresh());
      } else {
        toast.error(res.message || "Failed to update follow status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Navigate to user profile
  const handleUserRoute = (userId: number) => {
    dispatch(setUserId(userId));
    dispatch(hideModal("SearchAccounts"));
    router.push(`/profile/${userId}`);
  };

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(hideModal("SearchAccounts"))}
      fullWidth
      PaperProps={{
        sx: {
          p: 0,
          overflow: "visible",
          borderRadius: 3,
          maxHeight: "90vh",
          width: "420px",
          maxWidth: "100%",
        },
      }}
      BackdropProps={{
        sx: {
          background: "#000000BD",
        },
      }}
    >
      <button
        onClick={() => dispatch(hideModal("SearchAccounts"))}
        className="
          absolute -top-14 left-1/2 -translate-x-1/2
          w-11 h-11 rounded-full bg-primary flex items-center justify-center
          cursor-pointer shadow-md
        "
        style={{ zIndex: 1301 }}
      >
        <RxCross2 className="w-6 h-6 text-dark-text font-semibold" />
      </button>
      <div className="py-8 rounded-xl relative">

        <div className="pl-6 pt-4">
          <SearchInput placeholder="Search User" onSearch={handleSearch} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8 h-[500px]">
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
                  ref={index === users.length - 1 ? lastUserElementRef : null} // Add ref to last user
                  className="flex justify-between mb-4 items-center"
                >
                  <div
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => handleUserRoute(account.user_id)}
                  >
                    <div className="rounded-full w-[40px] h-[40px] overflow-hidden bg-gray-200">
                      <Image
                        src={account.profile_pic || ""}
                        alt={account.user_name}
                        className="w-full h-full object-cover"
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xs text-dark">
                        {account.user_name || "Unnamed"}
                      </h3>
                      <p className="text-[10px] text-dark/[0.4]">
                        {account.full_name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleFollowUnfollow(
                        account.user_id,
                        account.is_follow === true
                      )
                    }
                    className={`cursor-pointer text-[10px] font-normal rounded-xl w-16 py-1 ${
                      account.is_follow === true
                        ? "border border-main-green text-main-green"
                        : "bg-main-green text-primary"
                    }`}
                  >
                    {account.is_follow === true ? "Following" : "Follow"}
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
    </Dialog>
  );
}

export default SearchAccountsPopup;
