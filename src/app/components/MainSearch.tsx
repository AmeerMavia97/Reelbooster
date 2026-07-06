"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Dialog } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { hideModal } from "../store/Slice/ModalsSlice";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import SearchInput from "./SearchInput";
import useApiPost from "../hooks/postData";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import {
  decrementFollowing,
  incrementFollowing,
} from "../store/Slice/FollowFollowingCount";
import { triggerReelsRefresh } from "../store/Slice/fetchFollowReelsSlice";
import { setUserId } from "../store/Slice/UserIdHashtagIdSlice";
import { RxCross2 } from "react-icons/rx";
import { UserRecord } from "../types/ResTypes";

function MainSearch() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.MainSearch);
  const { postData } = useApiPost();
  const router = useRouter();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const MyUserId = Number(Cookies.get("Reelboost_user_id"));

  const containerRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);

  // for deduping/stale response handling
  const fetchIdRef = useRef(0);

  // Robust fetch that skips pages with only unnamed users
  const fetchUsers = useCallback(
    async (pageNum: number = 1, append = false, search = "") => {
      // if append and we've already passed last page, don't fetch
      if (append && pageNum > totalPages) return;
      // if no more overall, stop
      if (!append && !hasMore && pageNum !== 1) return;

      if (!append) setIsLoading(true);
      else setIsLoadingNext(true);

      const currentFetchId = ++fetchIdRef.current;

      try {
        const res = await postData("/users/find-user", {
          page: pageNum,
          user_name: search,
          name: search,
        });

        // ignore stale responses
        if (fetchIdRef.current !== currentFetchId) return;

        if (res?.status) {
          const raw = res.data?.Records || [];
          const pages = res.data?.Pagination?.total_pages || 1;

          // filter unnamed users
          const records: UserRecord[] = raw.filter(
            (u: UserRecord) => u.user_name && u.user_name.trim() !== ""
          );

          // update pagination metadata
          setTotalPages(pages);
          setPage(pageNum);

          if (records.length > 0) {
            setUsers((prev) => (append ? [...prev, ...records] : records));
            setHasMore(pageNum < pages); // there are more pages if current < pages
          } else if (pageNum < pages) {
            // this page had only invalid users — auto-skip to next page
            await fetchUsers(pageNum + 1, append, search);
            return; // don't run the "no-data" branch below yet
          } else {
            // no valid users and no more pages
            if (!append) setUsers([]);
            setHasMore(false);
          }
        } else {
          // API responded with status false
          if (!append) setUsers([]);
          setHasMore(false);
        }
      } catch (err) {
      } finally {
        // only clear loading flags for this fetch (prevent racing)
        if (fetchIdRef.current === currentFetchId) {
          setIsLoading(false);
          setIsLoadingNext(false);
        }
      }
    },
    [postData, totalPages, hasMore]
  );

  // initial fetch when dialog opens
  useEffect(() => {
    const fetchInitial = async () => {
      if (open && !initialLoadDone.current) {
        setUsers([]);
        setPage(1);
        setSearchText("");
        setHasMore(true);
        initialLoadDone.current = true;
        await fetchUsers(1, false, "");
      }
      if (!open) {
        // reset so next open triggers fresh fetch
        initialLoadDone.current = false;
        fetchIdRef.current++; // cancel inflight
      }
    };
    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, fetchUsers]);

  // debounce searchText -> debouncedSearch
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(t);
  }, [searchText]);

  // when debouncedSearch changes, fetch page 1 with that query (handles cleared text too)
  useEffect(() => {
    setUsers([]);
    setPage(1);
    setTotalPages(1);
    setHasMore(true);
    fetchIdRef.current++; // cancel older requests
    fetchUsers(1, false, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]); // fetchUsers is stable via useCallback

  // IntersectionObserver for infinite scroll
  const lastUserElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isLoadingNext) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            hasMore &&
            page < totalPages &&
            !isLoadingNext
          ) {
            fetchUsers(page + 1, true, debouncedSearch);
          }
        },
        { threshold: 0.1 }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, isLoadingNext, hasMore, page, totalPages, fetchUsers, debouncedSearch]
  );

  // search input handler: only update search text (debounce handles API call)
  const handleSearch = (text: string) => {
    const trimmed = text.trimStart(); // keep trailing removal to avoid immediate disappearance while typing
    setSearchText(trimmed);
    // do not call fetchUsers here — the debounced effect will handle it
  };

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
    dispatch(hideModal("MainSearch"));
    router.push(`/profile/${userId}`);
  };

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(hideModal("MainSearch"))}
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
        onClick={() => dispatch(hideModal("MainSearch"))}
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
            className="mt-4 h-[500px] overflow-y-auto px-6 text-dark"
          >
            {users.length === 0 ? (
              <p className="text-sm text-center text-gray-800">No users found.</p>
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
                      <p className="text-[12px] text-dark/[0.4]">
                        {account.full_name}
                      </p>
                    </div>
                  </div>
                  {account.user_id !== MyUserId && (
                    <button
                      onClick={() =>
                        handleFollowUnfollow(account.user_id, account.is_follow)
                      }
                      className={`cursor-pointer text-[10px] font-normal rounded-xl w-16 py-1 ${
                        account.is_follow
                          ? "border border-main-green text-main-green"
                          : "bg-main-green text-primary"
                      }`}
                    >
                      {account.is_follow ? "Following" : "Follow"}
                    </button>
                  )}
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

export default MainSearch;
