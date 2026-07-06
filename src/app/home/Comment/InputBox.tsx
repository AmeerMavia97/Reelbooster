import React, { useEffect, useState } from "react";
import useApiPost from "@/app/hooks/postData";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { clearReplyingTo } from "@/app/store/Slice/storeCommentsReplies";
import { setCommentAddedTrue } from "@/app/store/Slice/handleCommentCount";
import EmojiPickerButton from "./EmojiPickerButton"; // 👈 import your new component

interface InputBoxProps {
  onCommentAdded: () => void;
}

export default function InputBox({ onCommentAdded }: InputBoxProps) {
  const dispatch = useAppDispatch();
  const { postData } = useApiPost();
  const [text, setText] = useState("");

  const activeSocialUserId = useAppSelector(
    (state) => state.comment.activeReelUserId
  );
  const activeSocialId = useAppSelector(
    (state) => state.comment.activeCommentPostId
  );
  const replyingTo = useAppSelector((state) => state.comments.replyingTo);

  useEffect(() => {
    if (replyingTo) {
      setText(`@${replyingTo.userName} `);
    }
  }, [replyingTo]);

  const onSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    let commentToSend = trimmed;
    if (replyingTo && trimmed.startsWith(`@${replyingTo.userName}`)) {
      commentToSend = trimmed.replace(`@${replyingTo.userName}`, "").trim();
    }

    const payload = {
      social_id: activeSocialId,
      comment: commentToSend,
      user_id: activeSocialUserId,
      social_type: "reel",
      comment_owner_id: activeSocialUserId,
      ...(replyingTo ? { comment_ref_id: replyingTo.commentId } : {}),
    };

    try {
      await postData("/comment/add-comment", payload);
      onCommentAdded();
      setText("");
      dispatch(clearReplyingTo());
      dispatch(setCommentAddedTrue());
    } catch (error) {
    }
  };

  return (
    <div className="p-2 flex gap-2 place-items-center relative">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="w-full px-3 py-1.5 rounded bg-white text-xs text-dark focus:outline-none resize-none min-h-[24px] max-h-[60px] overflow-y-auto"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && text.trim()) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />

      <EmojiPickerButton
        onSelect={(emoji: string) => setText((prev) => prev + emoji)}
      />

      <button
        onClick={onSubmit}
        className="bg-main-green py-1 px-2 rounded-xl text-sm text-primary font-medium"
      >
        Send
      </button>
    </div>
  );
}
