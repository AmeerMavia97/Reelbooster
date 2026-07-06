"use client";

import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import React, { useEffect, useRef } from "react";
import useApiPost from "../hooks/postData";
import { FollowingRecord, FollowingRes } from "../types/FollowFollowingList";
import { ClipLoader } from "react-spinners";
import { setUserId } from "../store/Slice/UserIdHashtagIdSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  decrementFollowing,
  incrementFollowing,
} from "../store/Slice/FollowFollowingCount";
import Image from "next/image";
import { hideModal } from "@/app/store/Slice/ModalsSlice";
import { updateCurrentConversation } from "../store/Slice/CurrentConversationSlice";
import {
  clearMessageList,
  updateMessageList,
} from "../store/Slice/MessageListSlice";
import { resetPagination, updatePagination } from "../store/Slice/MessageOptionsSlice";
import { socketInstance } from "../socket/socket";
import { MessageListRes } from "../types/MessageListType";
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

function MyFollowing() {
  const open = useAppSelector((state) => state.modals.MyFollowing);
  const { following, page, hasMore, isLoading, isFetchingMore } =
    useAppSelector((state) => state.following);
  const chatList = useAppSelector((state) => state.chatList);

  const dispatch = useAppDispatch();
  const { postData } = useApiPost();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false); // Prevent multiple fetches
  const router = useRouter();

  // Fetch following API
  const fetchFollowing = async (pageNum: number, append = false) => {
    // guard: no more pages, avoid redundant fetch
    if (append && !hasMore) return;

    try {
      // set UI loading flags
      if (pageNum === 1) dispatch(setIsLoading(true));
      else dispatch(setIsFetchingMore(true));

      // mark fetching to avoid duplicate triggers
      isFetchingRef.current = true;

      const res: FollowingRes = await postData("/follow/follow-following-list", {
        page: pageNum,
        type: "following",
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
        // if current < total => has more
        dispatch(setHasMore(currentPageFromApi < totalPagesFromApi));
      } else {
        toast.error(res?.message || "Failed to fetch following");
      }
    } catch (err) {
      toast.error("Failed to fetch following");
    } finally {
      if (pageNum === 1) dispatch(setIsLoading(false));
      else dispatch(setIsFetchingMore(false));
      isFetchingRef.current = false;
    }
  };

  // On modal open -> reset + fetch first page
  useEffect(() => {
    if (open) {
      dispatch(resetFollowing());
      dispatch(setPage(1));
      // fetch first page directly
      fetchFollowing(1, false);
    }
    // intentionally depend only on `open` so it runs when modal opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // When page increments (due to scroll) -> fetch that page (append)
  useEffect(() => {
    // do not fetch when page is 1 (we already fetched on open)
    if (page > 1) {
      fetchFollowing(page, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Scroll handler using 50px threshold; sets page safely
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;

    // near bottom if remaining space is less than 50px
    const remaining = scrollHeight - scrollTop - clientHeight;
    if (remaining < 50 && hasMore && !isFetchingRef.current) {
      // set lock immediately to prevent multiple dispatches until fetch starts
      isFetchingRef.current = true;
      dispatch(setPage(page + 1));
    }
  };

  // Follow/Unfollow handler
  const handleFollowUnfollow = async (targetUserId: number, isFollowed: boolean) => {
    try {
      const res: FollowingRes = await postData("/follow/follow-unfollow", {
        user_id: targetUserId,
      });

      if (res.status) {
        toast.success(res?.message);
        dispatch(updateFollowStatus({ userId: targetUserId, isFollowed: !isFollowed }));
        dispatch(isFollowed ? decrementFollowing() : incrementFollowing());
      } else {
        toast.error(res?.message);
      }

      // close modal after action (as you did previously)
      dispatch(hideModal("MyFollowing"));
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Message user (keeps your existing logic)
  const handleMessage = async (targetUser: FollowingRecord["User"]) => {
    dispatch(hideModal("MyFollowing"));

    const existingChat = Array.isArray(chatList)
      ? chatList.find((chat) => chat.PeerUserData.user_id === targetUser.user_id)
      : null;

    const socket = socketInstance();

    // dispatch(clearMessageList());
    dispatch(resetPagination());

    if (existingChat && existingChat.Records.length > 0) {
      const record = existingChat.Records[0];

      dispatch(
        updateCurrentConversation({
          ...record,
          PeerUserData: existingChat.PeerUserData,
        })
      );

      if (socket) {
        socket.off("message_list");
        const handleMessageList = (res: MessageListRes) => {
          dispatch(updateMessageList(res.Records));
          dispatch(
            updatePagination({
              currentPage: res.Pagination.current_page,
              totalPages: res.Pagination.total_pages,
            })
          );
        };

        socket.on("message_list", handleMessageList);
      }
    } else {
      dispatch(
        updateCurrentConversation({
          chat_id: 0,
          PeerUserData: {
      ...targetUser,
      createdAt: new Date().toISOString(), // fallback for missing property
    },
          Messages: [],
          isNewConversation: true,
        })
      );
    }

    router.push("/message");
  };
  

  const handleUserRoute = (userId: number) => {
    dispatch(setUserId(userId));
    dispatch(hideModal("MyFollowing"));
    router.push(`/profile/${userId}`);
  };

  return (
    <CustomDialog
      open={open}
      onClose={() => dispatch(hideModal("MyFollowing"))}
      width="420px"
    >
      <div className="bg-primary py-6 rounded-xl">
        {/* Header */}
        <div className="place-items-center pb-5">
          <p className="font-medium text-sm text-center font-gilroy_semibold text-dark">
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
              <div className="flex flex-col place-items-center justify-center py-8">
                <Image src="/home/Empty.png" alt="empty" width={80} height={80} />
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
                            src={user.profile_pic || "/default-avatar.png"}
                            className="w-full h-full object-cover"
                            alt={user.user_name}
                            width={60}
                            height={60}
                          />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-xs text-dark">
                            {user.user_name || "username"}
                          </h3>
                          <p className="text-[10px] font-normal text-gray">
                            {user.full_name}
                          </p>
                        </div>
                      </div>

                      {record.isFollowed ? (
                        <button
                          className="cursor-pointer text-[10px] font-normal rounded-xl w-16 py-1 bg-transparent border border-main-green text-main-green"
                          onClick={() => handleMessage(user)}
                        >
                          Message
                        </button>
                      ) : (
                        <button
                          className="cursor-pointer text-[10px] font-normal rounded-xl w-16 py-1 bg-main-green text-primary"
                          onClick={() =>
                            handleFollowUnfollow(record.user_id, record.isFollowed)
                          }
                        >
                          Follow
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

export default MyFollowing;
