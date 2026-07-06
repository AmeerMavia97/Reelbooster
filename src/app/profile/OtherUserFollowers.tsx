"use client";

import React, { useEffect, useCallback } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import CustomDialog from "../components/CustomDialog";
import { hideModal } from "@/app/store/Slice/ModalsSlice";
import { setUserId } from "../store/Slice/UserIdHashtagIdSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import useApiPost from "../hooks/postData";
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
import { FollowersRes, FollowerRecord } from "../types/FollowFollowingList";

function OtherUserFollowers() {
  const open = useAppSelector((state) => state.modals.OtherUserFollowers);
  const dispatch = useAppDispatch();
  const { postData } = useApiPost();
  const router = useRouter();

  const { followers, page, hasMore, isLoading, isFetchingMore } =
    useAppSelector((state) => state.followers);

  // ✅ Always use OtherUserId from Redux
  const otherUserId = useAppSelector((state) => state.userId.user_id);

  // ✅ My userId only for hiding follow button
  const MyUserId = Cookies.get("Reelboost_user_id");

  /** Fetch followers */
  const fetchFollowers = useCallback(
    async (pageToFetch: number) => {
      if (!otherUserId) return;

      if (pageToFetch === 1) {
        dispatch(setIsLoading(true));
      } else {
        dispatch(setIsFetchingMore(true));
      }

      try {
        const res: FollowersRes = await postData(
          "/follow/follow-following-list",
          {
            page: pageToFetch,
            type: "follower",
            user_id: otherUserId, // ✅ Always otherUserId
          }
        );

        if (res?.status) {
          const records = res.data?.Records || [];
          if (pageToFetch === 1) {
            dispatch(setFollowers(records));
          } else {
            dispatch(appendFollowers(records));
          }

          dispatch(setHasMore(records.length > 0));
          dispatch(setPage(pageToFetch));
        } else {
          dispatch(setHasMore(false));
        }
      } catch (err) {
      } finally {
        dispatch(setIsLoading(false));
        dispatch(setIsFetchingMore(false));
      }
    },
    [dispatch, postData, otherUserId]
  );

  /** Initial load when modal opens */
  useEffect(() => {
    if (open && otherUserId) {
      dispatch(resetFollowers()); 
      fetchFollowers(1);
    }
  }, [open, otherUserId]);

  /** Infinite scroll */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if (!isFetchingMore && hasMore) {
        fetchFollowers(page + 1); 
      }
    }
  };

  /** Navigate to user profile */
  const handleUserRoute = (id: number) => {
    dispatch(setUserId(id));
    dispatch(hideModal("OtherUserFollowers"));
    if (id === parseInt(MyUserId || "0")) {
      router.push("/profile");
    } else {
      router.push(`/profile/${id}`);
    }
  };

  /** Follow/Unfollow */
  const handleFollowUnfollow = async (id: number, isFollowed: boolean) => {
    try {
      const res = await postData("/follow/follow-unfollow", { user_id: id });

      if (res.status) {
        toast.success(res.message);
        dispatch(updateFollowStatus({ userId: id, isFollowed: !isFollowed }));
      } else {
        toast.error(res.message || "Failed to update follow status");
      }
    } catch (error) {
      // toast.error("Something went wrong");
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={() => dispatch(hideModal("OtherUserFollowers"))}
      width="420px"
    >
      <div className="bg-primary py-6 rounded-xl">
        {/* Header */}
        <div className="place-items-center pb-3">
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

        {/* Followers List */}
        {isLoading ? (
          <div className="flex justify-center place-items-center h-[550px]">
            <ClipLoader color="#1A9D77" loading={isLoading} size={15} />
          </div>
        ) : (
          <div
            className="mt-4 max-h-[550px] overflow-y-auto px-6"
            onScroll={handleScroll}
          >
            {followers.length === 0 ? (
              <div className="flex flex-col items-center h-[500px] justify-center">
                <Image
                  src="/home/Empty.png"
                  height={80}
                  width={80}
                  alt="empty"
                />
                <p className="text-sm text-center text-gray-500">
                  No followers found.
                </p>
              </div>
            ) : (
              followers.map((record: FollowerRecord) => {
                const user = record.follower;
                return (
                  <div
                    key={record.follow_id}
                    className="flex justify-between mb-4 place-items-center cursor-pointer"
                  >
                    <div
                      className="flex gap-2 place-items-center"
                      onClick={() => handleUserRoute(user.user_id)}
                    >
                      <div className="rounded-full w-[40px] h-[40px] overflow-hidden bg-gray-200">
                        <Image
                          src={user.profile_pic}
                          className="w-full h-full object-cover"
                          alt={user.user_name}
                          width={40}
                          height={40}
                        />
                      </div>

                      <div className="flex flex-col">
                        <h3 className="text-xs text-dark">{user.user_name}</h3>
                        <p className="text-[10px] font-normal text-gray">
                          {user.full_name}
                        </p>
                      </div>
                    </div>

                    {user?.user_id != Number(MyUserId) && (
                      <button
                        className={`cursor-pointer text-[10px] font-normal rounded-xl w-16 py-1 ${
                          record.isFollowed
                            ? "border border-main-green text-main-green"
                            : "bg-main-green text-primary"
                        }`}
                        onClick={() =>
                          handleFollowUnfollow(user.user_id, record.isFollowed)
                        }
                      >
                        {record.isFollowed ? "Following" : "Follow"}
                      </button>
                    )}
                  </div>
                );
              })
            )}

            {/* Loader while fetching more */}
            {isFetchingMore && (
              <div className="flex justify-center py-3">
                <ClipLoader color="#1A9D77" loading={isFetchingMore} size={15} />
              </div>
            )}
          </div>
        )}
      </div>
    </CustomDialog>
  );
}

export default OtherUserFollowers;
