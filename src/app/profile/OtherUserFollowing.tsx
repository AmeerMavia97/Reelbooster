"use client";

import { hideModal } from "@/app/store/Slice/ModalsSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import React, { useEffect, useRef } from "react";
import useApiPost from "../hooks/postData";
import { FollowingRes } from "../types/FollowFollowingList";
import { ClipLoader } from "react-spinners";
import { setUserId } from "../store/Slice/UserIdHashtagIdSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import Cookies from "js-cookie";
import CustomDialog from "../components/CustomDialog";
import {
  setFollowing,
  appendFollowing,
  setPage,
  setTotalPages,
  setHasMore,
  setIsLoading,
  setIsFetchingMore,
  updateFollowStatus,
  resetFollowing,
} from "../store/Slice/FollowingSlice";

function OtherUserFollowing() {
  const open = useAppSelector((state) => state.modals.OtherUserFollowing);
  const {
    following,
    page,
    hasMore,
    isLoading,
    isFetchingMore,
  } = useAppSelector((state) => state.following);
  const userId = useAppSelector((state) => state.userId.user_id);

  const dispatch = useAppDispatch();
  const { postData } = useApiPost();
  const router = useRouter();
  const MyUserId = Cookies.get("Reelboost_user_id");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  // Fetch following API
  const fetchFollowing = async (pageNum: number, append = false) => {
    if (append && !hasMore) return;

    try {
      if (pageNum === 1) dispatch(setIsLoading(true));
      else dispatch(setIsFetchingMore(true));

      isFetchingRef.current = true;

      const res: FollowingRes = await postData("/follow/follow-following-list", {
        page: pageNum,
        type: "following",
        user_id: userId,
      });

      if (res?.status) {
        const newRecords = res.data.Records || [];

        if (pageNum === 1) {
          dispatch(setFollowing(newRecords));
        } else {
          dispatch(appendFollowing(newRecords));
        }

        const pagination = res.data?.Pagination;
        const totalPagesFromApi = pagination?.total_pages || 1;
        const currentPageFromApi = pagination?.current_page || pageNum;

        dispatch(setTotalPages(totalPagesFromApi));
        dispatch(setHasMore(currentPageFromApi < totalPagesFromApi));
      } else {
        toast.error(res?.message || "Failed to fetch following");
      }
    } catch (err) {
      // toast.error("Failed to fetch following");
    } finally {
      if (pageNum === 1) dispatch(setIsLoading(false));
      else dispatch(setIsFetchingMore(false));
      isFetchingRef.current = false;
    }
  };

  // On modal open -> reset + fetch first page
  useEffect(() => {
    if (open && userId) {
      dispatch(resetFollowing());
      dispatch(setPage(1));
      fetchFollowing(1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, userId]);

  // When page increments -> fetch next page
  useEffect(() => {
    if (page > 1) fetchFollowing(page, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;

    const remaining = scrollHeight - scrollTop - clientHeight;
    if (remaining < 50 && hasMore && !isFetchingRef.current) {
      isFetchingRef.current = true;
      dispatch(setPage(page + 1));
    }
  };

  // Follow/Unfollow handler
  const handleFollowUnfollow = async (targetUserId: number, isFollowed: boolean) => {
    try {
      const res = await postData("/follow/follow-unfollow", {
        user_id: targetUserId,
      });

      if (res.status) {
        toast.success(res.message);
        dispatch(updateFollowStatus({ userId: targetUserId, isFollowed: !isFollowed }));
      } else {
        toast.error(res.message || "Failed to update follow status");
      }
    } catch (error) {
      // toast.error("Something went wrong");
    }
  };

  // Navigate to profile
  const handleUserRoute = (targetUserId: number) => {
    dispatch(setUserId(targetUserId));
    dispatch(hideModal("OtherUserFollowing"));
    if (targetUserId === parseInt(MyUserId ?? "")) {
      router.push("/profile");
    } else {
      router.push(`/profile/${targetUserId}`);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={() => dispatch(hideModal("OtherUserFollowing"))}
      width="420px"
    >
      <div className="bg-primary py-6 rounded-xl">
        {/* Header */}
        <div className="place-items-center pb-3">
          <p className="font-medium text-sm text-center font-gilroy_semibold text-black">
            Following
          </p>
          <div className="flex place-items-center justify-center">
            <div
              className="w-10 h-[1.2px]"
              style={{
                background:
                  "linear-gradient(141.72deg, #239C57 -1.01%, #019FC8 103.86%)",
              }}
            />
            <div
              className="rounded-full w-1.5 h-1.5"
              style={{
                background:
                  "linear-gradient(141.72deg, #239C57 -1.01%, #019FC8 103.86%)",
              }}
            />
          </div>
        </div>

        {/* Following List */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ClipLoader color="#1A9D77" size={20} />
          </div>
        ) : (
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="mt-4 overflow-y-auto max-h-[550px] px-6 scrollbar-thin scrollbar-thumb-gray-300"
          >
            {following.length === 0 ? (
              <div className="flex flex-col items-center h-[500px] justify-center">
                <Image src="/home/Empty.png" height={80} width={80} alt="empty" />
                <p className="text-sm text-center text-gray-500">
                  Not following anyone yet.
                </p>
              </div>
            ) : (
              <>
                {following.map((record) => {
                  const user = record.User;
                  return (
                    <div
                      key={record.follow_id}
                      className="flex justify-between mb-4 place-items-center"
                    >
                      <div
                        className="flex gap-2 place-items-center cursor-pointer"
                        onClick={() => handleUserRoute(record.user_id)}
                      >
                        <div className="rounded-full w-[40px] h-[40px] overflow-hidden bg-gray-200">
                          <Image
                            src={user?.profile_pic || "/default-avatar.png"}
                            className="w-full h-full object-cover"
                            alt={user?.user_name}
                            width={60}
                            height={60}
                          />
                        </div>

                        <div className="flex flex-col">
                          <h3 className="text-xs text-dark">{user?.user_name}</h3>
                          <p className="text-[10px] font-normal text-gray">
                            {user?.full_name}
                          </p>
                        </div>
                      </div>

                      {user?.user_id != Number(MyUserId) && (
                        <button
                          className={`cursor-pointer text-[10px] font-normal rounded-xl w-16 py-1 ${
                            record.isFollowed
                              ? "border-main-green border text-main-green"
                              : " bg-main-green text-primary"
                          }`}
                          onClick={() =>
                            handleFollowUnfollow(record.user_id, record.isFollowed)
                          }
                        >
                          {record.isFollowed ? "Following" : "Follow"}
                        </button>
                      )}
                    </div>
                  );
                })}
                {isFetchingMore && (
                  <div className="flex justify-center py-4">
                    <ClipLoader color="#1A9D77" size={15} />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </CustomDialog>
  );
}

export default OtherUserFollowing;
