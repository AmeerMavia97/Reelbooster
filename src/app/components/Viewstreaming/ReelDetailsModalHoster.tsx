"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Dialog } from "@mui/material";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import useApiPost from "@/app/hooks/postData";

import {
  clearSelectedReel,
  incrementCommentCount,
  updateBookmarkStatus,
  updateFollowStatus,
  updateLikeStatus,
} from "@/app/store/Slice/SelectedReelDetail";

import { setReels } from "@/app/store/Slice/UserReelsSlice";
import { setCommentAddedFalse } from "@/app/store/Slice/handleCommentCount";
import { setHashtag } from "@/app/store/Slice/UserIdHashtagIdSlice";

import CommentBoxHoster from "./CommentBoxHoster";
import { setIsApiCall } from "@/app/store/Slice/uiSlice";

const ReelDetailsModalHoster = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { postData } = useApiPost();

  const reel = useAppSelector((s) => s.selectedReel.reel);
  const reels = useAppSelector((s) => s.userReels.reels);
  const commentAdded = useAppSelector((s) => s.commentAdded.commentAdded);



  /** Helper to sync reel list */
  const updateReels = (cb: (list: any[]) => any[]) => {
    dispatch(setReels(cb(reels)));
  };

  /* ========================= LIKE ========================= */
  const handleLike = async (socialId: number, userId: number) => {
    dispatch(updateLikeStatus());

    updateReels((list) =>
      list.map((r) =>
        r.social_id === socialId
          ? {
            ...r,
            isLiked: !r.isLiked,
            total_likes: Number(r.total_likes) + (r.isLiked ? -1 : 1),
          }
          : r
      )
    );

    await postData("/like/like-unlike", {
      social_id: socialId,
      social_type: "reel",
      user_id: userId,
    });
  };

  /* ========================= FOLLOW ========================= */
  const handleFollowUnfollow = async (userId: number) => {

    dispatch(setIsApiCall(false));   // API started

    dispatch(updateFollowStatus());

    updateReels((list) =>
      list.map((r) =>
        r.User.user_id === userId
          ? { ...r, isFollowing: !r.isFollowing }
          : r
      )
    );
    await postData("/follow/follow-unfollow", { user_id: userId });
    dispatch(setIsApiCall(true));   // API started
  };

  /* ========================= SAVE ========================= */
  const handleBookmark = async (socialId: number) => {
    dispatch(updateBookmarkStatus());

    updateReels((list) =>
      list.map((r) =>
        r.social_id === socialId
          ? {
            ...r,
            isSaved: !r.isSaved,
            total_saves: Number(r.total_saves) + (r.isSaved ? -1 : 1),
          }
          : r
      )
    );

    await postData("/save/save-unsave", { social_id: socialId });
  };

  /* ========================= COMMENT COUNT ========================= */
  useEffect(() => {
    if (!commentAdded) return;

    dispatch(incrementCommentCount());

    updateReels((list) =>
      list.map((r) =>
        r.social_id === reel.social_id
          ? { ...r, total_comments: Number(r.total_comments) + 1 }
          : r
      )
    );

    dispatch(setCommentAddedFalse());
  }, [commentAdded]);

  /* ========================= ROUTE USER ========================= */
  const handleUserRoute = (userId: number) => {
    dispatch(clearSelectedReel());
    router.push(`/profile/${userId}`);
  };


  if (!reel) return null;

  return (
    <Dialog
      open={Boolean(reel)}
      onClose={() => dispatch(clearSelectedReel())}
      fullWidth
      PaperProps={{
        sx: {
          p: 0,
          overflow: "visible",
          borderRadius: 3,
          maxHeight: "90vh",
          width: "1500px",
          maxWidth: "100%",
        },
      }}
      BackdropProps={{ sx: { background: "#000000BD" } }}
    >
      <div className="bg-primary rounded-lg shadow-lg flex overflow-hidden relative">
        {/* Close */}
        <button
          onClick={() => dispatch(clearSelectedReel())}
          className="absolute top-1 right-2 text-dark text-sm z-50 cursor-pointer"
        >
          ✕
        </button>

        {/* ================= LEFT VIDEO ================= */}
        <div className="sm:w-7/10 bg-dark relative sm:block hidden">
          {reel?.Media?.length > 0 ? (
            <video
              src={reel.Media[0].media_location}
              autoPlay
              muted
              loop
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white">
              No Media
            </div>
          )}
        </div>

        {/* ================= RIGHT DETAILS ================= */}
        <div className="sm:w-1/2 flex flex-col max-h-[90vh]">
          <div className="px-6 pt-4 pr-4">
            {/* User */}
            <div className="flex justify-between items-center pr-6">
              <div className="flex items-center gap-3">
                <Image
                  src={reel.User.profile_pic}
                  alt={reel.User.user_name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <h2
                  className="text-base font-medium cursor-pointer"
                  onClick={() => handleUserRoute(reel.User.user_id)}
                >
                  {reel.User.user_name}
                </h2>
              </div>

              <button
                className={`sm:w-[20%] p-1 rounded-xl ${reel.isFollowing
                  ? "border border-main-green text-main-green"
                  : "bg-main-green text-primary"
                  }`}
                onClick={() => handleFollowUnfollow(reel.User.user_id)}
              >
                {reel.isFollowing ? "Following" : "Follow"}
              </button>
            </div>

            {/* Caption */}
            <div className="text-sm my-4 text-gray-700">
              {reel.social_desc?.split(/(\s+)/).map((part, i) =>
                part.startsWith("#") ? (
                  <span
                    key={i}
                    className="text-main-green cursor-pointer"
                    onClick={() => {
                      dispatch(
                        setHashtag({ hashtag_name: part.replace("#", "") })
                      );
                      dispatch(clearSelectedReel());
                      router.push("/explore");
                    }}
                  >
                    {part}
                  </span>
                ) : (
                  part
                )
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-6 items-center mb-4">
              <div className="flex gap-1 items-center">
                <Image
                  src={
                    reel.isLiked
                      ? "/home/filled_heart.png"
                      : "/home/like.png"
                  }
                  alt="like"
                  width={18}
                  height={18}
                  onClick={() =>
                    handleLike(reel.social_id, reel.User.user_id)
                  }
                />
                <span>{reel.total_likes} likes</span>
              </div>

              <div className="flex gap-1 items-center">
                <Image src="/home/comment.png" alt="comment" width={18} height={18} />
                <span>{reel.total_comments} comments</span>
              </div>

              <div className="flex gap-1 items-center">
                <Image
                  src={
                    reel.isSaved
                      ? "/home/filled_bookmark.png"
                      : "/home/bookmark.png"
                  }
                  alt="save"
                  width={18}
                  height={18}
                  onClick={() => handleBookmark(reel.social_id)}
                />
                <span>{reel.total_saves} saves</span>
              </div>
            </div>
          </div>

          <hr />

          {/* Comments */}
          <div className="flex-1 overflow-hidden">
            <CommentBoxHoster />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ReelDetailsModalHoster;
