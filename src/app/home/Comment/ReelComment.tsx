"use client";
import { RxCross2 } from "react-icons/rx";
import CommentBox from "./CommentBox";
import { useAppDispatch } from "@/app/utils/hooks";
import { setActiveCommentPostId } from "@/app/store/Slice/ActiveCommentBox";

function ReelComment() {
  const dispatch = useAppDispatch();
  return (
    <>
      <div className="bg-primary rounded-lg h-full flex flex-col pt-4">
        <div className="flex justify-between items-center pb-2">
          <h2 className="text-base text-dark pl-4">Comments</h2>
          <div
            className="cursor-pointer pr-4"
            onClick={() => dispatch(setActiveCommentPostId(null))}
          >
            <RxCross2 className="text-dark" />
          </div>
        </div>

        {/* CommentBox with full height */}
        <div className="flex-1 overflow-hidden ">
          <CommentBox />
        </div>
      </div>
    </>
  );
}

export default ReelComment;
