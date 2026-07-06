"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Record } from "@/app/types/CommentRes";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { useReplies } from "@/app/store/api/getCommentReply";
import { setReplyingTo } from "@/app/store/Slice/storeCommentsReplies";
import useApiPost from "@/app/hooks/postData";
import { LikeUnlikeResponse } from "@/app/types/ResTypes";
import { toast } from "react-toastify";
import { formatTimeAgo } from "@/app/components/formatDates/formatTimeAgo";

interface Props {
  record: Record;
}

export default function CommentItem({ record }: Props) {
  const [showReplies, setShowReplies] = useState(false);
  const [likeCount, setLikeCount] = useState(record?.like_count || 0);
  const [isLiked, setIsLiked] = useState(record?.isLiked === 1);
  const [subcommentLikeCount, setSubcommentLikeCount] = useState(
    record?.like_count || 0
  );
  const [isSubcommentLiked, setIsSubcommentLiked] = useState(
    record?.isLiked === 1
  );
  const dispatch = useAppDispatch();
  const replies = useAppSelector((state) => state.comments.replies || []);
  const { postData } = useApiPost();

  const { isLoading } = useReplies(record?.comment_id, showReplies);

  const handleViewReplies = () => {
    setShowReplies((prev) => !prev);
  };

  // all field data for like
  const socialId = useAppSelector((state) => state.comment.activeCommentPostId);
  const userId = useAppSelector((state) => state.comment.activeReelUserId);

  // like main comment ====================================
  const handleLikeComment = async (commentId: number) => {
    // Optimistic UI update
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const response: LikeUnlikeResponse = await postData("/like/like-unlike", {
        social_id: socialId,
        social_type: "reel",
        user_id: userId,
        comment_id: commentId,
      });
      if (response?.status) {
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
        // Revert changes if failed
        setIsLiked((prev) => !prev);
        setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
      }
    } catch (error) {
      // Revert on error
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  // like subcomment ======================
  const handleLikeSubcomment = async (commentId: number) => {
    // Optimistic UI update
    setIsSubcommentLiked((prev) => !prev);
    setSubcommentLikeCount((prev) => (isSubcommentLiked ? prev - 1 : prev + 1));

    try {
      const response: LikeUnlikeResponse = await postData("/like/like-unlike", {
        social_id: socialId,
        social_type: "reel",
        user_id: userId,
        comment_id: commentId,
      });
      if (response?.status) {
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
        // Revert changes if failed
        setIsSubcommentLiked((prev) => !prev);
        setSubcommentLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
      }
    } catch (error) {
      // Revert on error
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className="space-y-2 pr-4">
      {/* Main Comment */}
      <div className="flex items-start gap-3">
        <div className="rounded-full w-8 h-8">
          <Image
            src={record?.commenter?.profile_pic}
            className="w-full h-full object-cover rounded-full"
            alt="profile"
            width={40}
            height={40}
          />
        </div>

        <div className="flex-1">
          <div className="text-[12px] font-medium text-dark cursor-pointer">
            {record?.commenter?.user_name}  
          </div>
          <div className="flex justify-between">
            <div className="text-[12px] text-[#656565]">{record?.comment}</div>
            {/* <PiHeart
              className={`cursor-pointer ${
                record?.isLiked === 1 ? "text-red" : "text-gray"
              }`}
              onClick={() => handleLikeComment(record?.comment_id)}
            /> */}
            {/* <Image src={record?.isLiked === 1 ? "/home/filled_heart.png" : "/home/like.png"} className="cursor-pointer" height={20} width={20} onClick={() => handleLikeComment(record?.comment_id)} alt="like" /> */}

            <Image
              src={isLiked ? "/home/filled_heart.png" : "/home/like.png"}
              className="cursor-pointer transition duration-150 ease-in-out h-fit"
              height={18}
              width={18}
              onClick={() => handleLikeComment(record?.comment_id)}
              alt="like"
            />
          </div>
          <div className="text-[10px] text-gray-500 flex gap-4 mt-1">
            <span>{formatTimeAgo(record?.createdAt)}</span>
            <span className="cursor-pointer hover:underline">
              {likeCount} like
            </span>

            <span
              className="cursor-pointer hover:underline"
              onClick={() =>
                dispatch(
                  setReplyingTo({
                    commentId: record?.comment_id,
                    userName: record?.commenter?.user_name || "user",
                  })
                )
              }
            >
              Reply
            </span>
          </div>

          {record?.reply_count > 0 && (
            <div
              className="text-xs text-gray font-medium cursor-pointer mt-1"
              onClick={handleViewReplies}
            >
              <div className="flex gap-2 text-[10px] py-1 place-items-center">
                <hr className="w-10" />
                {showReplies
                  ? "Hide replies"
                  : `View replies (${record?.reply_count})`}
                <hr className="w-10" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies (only shown under this comment) */}

      {showReplies && (
        <div className="ml-10 space-y-2">
          {isLoading && (
            <div className="text-xs text-gray-400">Loading replies...</div>
          )}
          {replies?.map((reply) => (
            <div key={reply?.comment_id} className="flex items-start gap-3">
              <div className="rounded-full w-8 h-8">
                <Image
                  src={reply?.commenter?.profile_pic}
                  className="w-full h-full object-cover"
                  alt="profile"
                  width={30}
                  height={30}
                />
              </div>
              <div className="flex-1">
                <div className="text-[12px] font-medium text-dark">
                  {reply?.commenter?.first_name}
                </div>
                <div className="flex justify-between">
                  <div className="text-[12px] text-dark-gray">
                    {reply?.comment}
                  </div>
                  <Image
                    src={
                      isSubcommentLiked
                        ? "/home/filled_heart.png"
                        : "/home/like.png"
                    }
                    className="cursor-pointer transition duration-150 ease-in-out h-fit"
                    height={18}
                    width={18}
                    onClick={() => handleLikeSubcomment(record?.comment_id)}
                    alt="like"
                  />
                </div>
                <div className="text-[10px] text-gray-500 flex gap-4 mt-1">
                  <span>{formatTimeAgo(reply?.createdAt)}</span>
                  <span className="cursor-pointer hover:underline">
                    {subcommentLikeCount} like
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
