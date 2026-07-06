"use client";

import { hideModal } from "@/app/store/Slice/ModalsSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import React, { useEffect, useRef } from "react";
import useApiPost from "../hooks/postData";
import { FollowersRes } from "../types/FollowFollowingList";
import { ClipLoader } from "react-spinners";
import { setUserId } from "../store/Slice/UserIdHashtagIdSlice";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  decrementFollowing,
  incrementFollowing,
} from "../store/Slice/FollowFollowingCount";
import Image from "next/image";
import CustomDialog from "../components/CustomDialog";
import {
  setFollowers,
  appendFollowers,
  setPage,
  setHasMore,
  setIsLoading,
  setIsFetchingMore,
  updateFollowStatus,
  resetFollowers,
} from "../store/Slice/FollowersSlice";

interface MyFollowersProps {
  userId?: string | number;
}

function MyFollowers({ userId }: MyFollowersProps) {
  const open = useAppSelector((state) => state.modals.MyFollowers);
  const { followers, page, hasMore, isLoading, isFetchingMore } = useAppSelector(
    (state) => state.followers
  );

  const dispatch = useAppDispatch();
  const { postData } = useApiPost();
  const fallbackUserId = Cookies.get("Reelboost_user_id");
  const finalUserId = userId || fallbackUserId;

  const listRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const router = useRouter();

  // Fetch followers
  const fetchFollowers = async (pageNum: number, append = false) => {
    if (!finalUserId || (!hasMore && append)) return;

    try {
      dispatch(pageNum === 1 ? setIsLoading(true) : setIsFetchingMore(true));
      isFetchingRef.current = true;

      const res: FollowersRes = await postData(
        "/follow/follow-following-list",
        {
          page: pageNum,
          type: "follower",
          user_id: finalUserId,
        }
      );

      if (res?.status === true) {
        const newRecords = res.data.Records || [];
        dispatch(append ? appendFollowers(newRecords) : setFollowers(newRecords));

        const total = res.data?.Pagination?.total_records || 0;
        const totalFetched =
          (append ? followers.length : 0) + newRecords.length;
        dispatch(setHasMore(totalFetched < total));
      }
    } catch (err) {
      // toast.error("Failed to fetch followers");
    } finally {
      dispatch(pageNum === 1 ? setIsLoading(false) : setIsFetchingMore(false));
      isFetchingRef.current = false;
    }
  };

  // On modal open
  useEffect(() => {
    if (open) {
      dispatch(resetFollowers());
      dispatch(setPage(1));
      fetchFollowers(1, false);
    }
  }, [open, finalUserId]);

  // Fetch when page increments
  useEffect(() => {
    if (page > 1) {
      fetchFollowers(page, true);
    }
  }, [page]);

  // Scroll handler (same as OtherUserFollowers)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || isFetchingRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      dispatch(setPage(page + 1));
    }
  };

  // Navigate to user profile
  const handleUserRoute = (userId: number) => {
    dispatch(setUserId(userId));
    dispatch(hideModal("MyFollowers"));
    router.push(`/profile/${userId}`);
  };

  // Follow/Unfollow
  const handleFollowUnfollow = async (
    targetUserId: number,
    isFollowed: boolean
  ) => {
    try {
      const res: FollowersRes = await postData("/follow/follow-unfollow", {
        user_id: targetUserId,
      });

      if (res.status === true) {
        toast.success(res?.message);
        dispatch(
          updateFollowStatus({ userId: targetUserId, isFollowed: !isFollowed })
        );
        dispatch(isFollowed ? decrementFollowing() : incrementFollowing());
      } else {
        toast.error(res?.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={() => dispatch(hideModal("MyFollowers"))}
      width="420px"
    >
      <div className="bg-primary py-6 rounded-xl">
        {/* Header */}
        <div className="place-items-center pb-5">
          <p className="font-medium text-sm text-center font-gilroy_semibold text-dark">
            Followers
          </p>
          <div className="flex place-items-center justify-center">
            <div
              className="w-10 h-[1.2px]"
              style={{
                background:
                  "linear-gradient(141.72deg, #239C57 -1.01%, #019FC8 103.86%)",
              }}
            ></div>
            <div
              className="rounded-full w-1.5 h-1.5"
              style={{
                background:
                  "linear-gradient(141.72deg, #239C57 -1.01%, #019FC8 103.86%)",
              }}
            ></div>
          </div>
        </div>

        {/* Followers List */}
        {isLoading ? (
          <div className="flex justify-center place-items-center py-10">
            <ClipLoader color="#1A9D77" size={15} />
          </div>
        ) : (
          <div
            ref={listRef}
            onScroll={handleScroll}  // ✅ Trigger infinite scroll
            className="mt-4 overflow-y-auto max-h-[550px] px-2 scrollbar-thin scrollbar-thumb-gray-300"
          >
            {followers.length === 0 ? (
              <div className="flex flex-col place-items-center justify-center py-8">
                <Image
                  src="/home/Empty.png"
                  alt="empty"
                  height={80}
                  width={80}
                />
                <p className="text-sm text-center text-gray-500">
                  No followers found.
                </p>
              </div>
            ) : (
              <>
                {followers.map((record) => {
                  const user = record.follower;
                  return (
                    <div
                      key={record.follow_id}
                      className="flex justify-between mb-4 px-4 place-items-center"
                    >
                      <div
                        className="flex gap-2 place-items-center cursor-pointer"
                        onClick={() => handleUserRoute(user.user_id)}
                      >
                        <div className="rounded-full w-[40px] h-[40px] bg-gray-200">
                          <Image
                            src={user.profile_pic}
                            className="w-full h-full object-cover rounded-full"
                            alt={user.user_name}
                            height={40}
                            width={40}
                          />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-xs text-dark">
                            {user.user_name}
                          </h3>
                          <p className="text-[10px] font-normal text-gray">
                            {user.full_name}
                          </p>
                        </div>
                      </div>

                      <button
                        className={`cursor-pointer rounded-xl text-[10px] font-normal w-20 py-1 ${
                          record.isFollowed
                            ? "border border-main-green text-main-green"
                            : "bg-main-green text-primary"
                        }`}
                        onClick={() =>
                          handleFollowUnfollow(user.user_id, record.isFollowed)
                        }
                      >
                        {record.isFollowed ? "Following" : "Follow Back"}
                      </button>
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

export default MyFollowers;
