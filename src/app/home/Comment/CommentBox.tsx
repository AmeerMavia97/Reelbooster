import React, { useEffect, useRef } from "react";
import CommentItem from "./CommentItem";
import InputBox from "./InputBox";
import { useAppSelector, useAppDispatch } from "@/app/utils/hooks";
import { useCommentList } from "@/app/store/api/getCommentList";
import Image from "next/image";
import {
  nextPage,
  setCurrentPage,
  setRefId,
  setSocialId,
} from "@/app/store/Slice/commentSlice";
import { setMainComments } from "@/app/store/Slice/storeCommentsReplies";
import { useQueryClient } from "@tanstack/react-query";

export default function CommentBox() {
  const dispatch = useAppDispatch();
  const { currentPage, commentRefId } = useAppSelector((s) => s.getComment);
  const activeCommentPostId = useAppSelector(
    (state) => state.comment.activeCommentPostId
  );
  const allComments = useAppSelector((state) => state.comments.mainComments);

  const { data, isFetching } = useCommentList(
    activeCommentPostId ?? 0,
    currentPage,
    commentRefId
  );

  useEffect(() => {
    dispatch(setSocialId(activeCommentPostId ?? 0));
    dispatch(setRefId(0));
    dispatch(setCurrentPage(1));
  }, [activeCommentPostId, dispatch]);

  useEffect(() => {
    if (!data) return;

    if (currentPage === 1) {
      dispatch(setMainComments(data.comments));
    } else {
      const existingIds = new Set(allComments.map((c) => c.comment_id));
      const newUnique = data.comments.filter(
        (c) => !existingIds.has(c.comment_id)
      );
      if (newUnique.length > 0) {
        dispatch(setMainComments([...allComments, ...newUnique]));
      }
    }
  }, [data, currentPage, allComments, dispatch]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el || isFetching) return;

    const { scrollHeight, scrollTop, clientHeight } = el;

    if (scrollHeight - scrollTop <= clientHeight + 30) {
      if (data && currentPage < data.pagination.total_pages) {
        dispatch(nextPage());
      }
    }
  };
  const queryClient = useQueryClient();

  const handleCommentAdded = () => {
    dispatch(setCurrentPage(1));

    queryClient.refetchQueries({
      queryKey: [
        "comments",
        activeCommentPostId,
        1,
        commentRefId && commentRefId > 0 ? commentRefId : "no-ref",
      ],
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable comment area */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto py-3 pr-1 space-y-4 px-6"
      >
        {allComments.length === 0 && !isFetching && (
          <div className=" flex flex-col gap-1 place-items-center justify-center min-h-80">
            <Image src="/home/NoComment.png" alt="empty" width={70} height={70} />
            <p className="text-center text-sm text-gray">No comments yet.</p>
          </div>
        )}

        {allComments
          .slice()
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
          .map((record) => (
            <CommentItem key={record.comment_id} record={record} />
          ))}

        {isFetching && (
          <div className="text-center text-gray-400 text-sm">Loading...</div>
        )}
      </div>

      {/* Input box pinned at bottom */}
      <div className="border-t border-[#F0F0F0] pt-2 bg-primary">
        <InputBox onCommentAdded={handleCommentAdded} />
      </div>
    </div>
  );
}
