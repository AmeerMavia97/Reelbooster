"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import {
  clearSelectedReel,
  incrementCommentCount,
  setSelectedReel,
  updateBookmarkStatus,
  updateFollowStatus,
  updateLikeStatus,
} from "../store/Slice/SelectedReelDetail";
import Image from "next/image";
import CommentBox from "../home/Comment/CommentBox";
import { Dialog } from "@mui/material";
import { LikeUnlikeResponse, SaveUnsaveResponse } from "../types/ResTypes";
import useApiPost from "../hooks/postData";
import { toast } from "react-toastify";
import { setCommentAddedFalse } from "../store/Slice/handleCommentCount";
import { useRouter } from "next/navigation";
import { setHashtag, setUserId } from "../store/Slice/UserIdHashtagIdSlice";
import { Reel } from "../types/Reels";
import { normalizeMediaUrl } from "../utils/mediaUrl";

interface ReelDetailsModalProps {
  setReels: React.Dispatch<React.SetStateAction<Reel[]>>;
}

const ReelDetailsModal = ({ setReels }: ReelDetailsModalProps) => {
  const dispatch = useAppDispatch();
  const reel = useAppSelector((state) => state.selectedReel.reel);
  const { postData } = useApiPost();
  const router = useRouter();

  const handleUserRoute = (userId: number) => {
      dispatch(setUserId(userId));
      dispatch(clearSelectedReel())
      router.push(`/profile/${userId}`);
    };

  // Like Unlike
  const handleLike = async (socialId: number, userId: number) => {
    const previousState = {
      isLiked: reel?.isLiked,
      total_likes: reel?.total_likes,
    };
    dispatch(updateLikeStatus()); // Optimistic update for UI
    setReels((prevReels) =>
      prevReels.map((r) =>
        r.social_id === socialId
          ? {
              ...r,
              isLiked: !r.isLiked,
              total_likes: Number(r.total_likes) + (r.isLiked ? -1 : 1), // keep number
            }
          : r
      )
    );

    try {
      const response: LikeUnlikeResponse = await postData("/like/like-unlike", {
        social_id: socialId,
        social_type: "reel",
        user_id: userId,
      });
      if (response.status) {
        toast.success(response.message);
      } else {
        throw new Error(response.message || "Failed to update like status");
      }
    } catch (error) {
      dispatch(updateLikeStatus()); // Revert Redux state

      if (!previousState) return; // stop if not found

      setReels((prevReels) =>
        prevReels.map((r) =>
          r.social_id === socialId
            ? {
                ...r,
                isLiked: previousState.isLiked ?? r.isLiked,
                total_likes: previousState.total_likes ?? r.total_likes,
              }
            : r 
        )
      );
    }
  };

  // Follow Unfollow User
  const handleFollowUnfollow = async (userId: number) => {
    const previousState =
      typeof reel?.isFollowing === "boolean" ? reel.isFollowing : false;
    dispatch(updateFollowStatus());
    setReels((prevReels) =>
      prevReels.map((r) =>
        r.User.user_id === userId
          ? {
              ...r,
              isFollowing:
                typeof r.isFollowing === "boolean" ? !r.isFollowing : true,
            }
          : r
      )
    );
    try {
      const res = await postData("/follow/follow-unfollow", {
        user_id: userId,
      });
      if (res.status) {
        toast.success(res.message);
      } else {
        throw new Error(res.message || "Failed to update follow status");
      }
    } catch (error) {
      dispatch(updateFollowStatus()); // Revert Redux state
      setReels((prevReels) =>
        prevReels.map((r) =>
          r.User.user_id === userId
            ? {
                ...r,
                isFollowing:
                  typeof previousState === "boolean" ? previousState : false,
              }
            : r
        )
      ); // Revert Explore state
    }
  };

  // Save Reel
  const handleBookmark = async (socialId: number) => {
    const previousState = {
      isSaved: reel?.isSaved,
      total_saves: reel?.total_saves,
    };
    dispatch(updateBookmarkStatus()); // Optimistic update for UI
    setReels((prevReels) =>
      prevReels.map((r) =>
        r.social_id === socialId
          ? {
              ...r,
              isSaved: !r.isSaved,
              total_saves: Number(r.total_saves) + (r.isSaved ? -1 : 1),
            }
          : r
      )
    ); // Update Explore state
    try {
      const response: SaveUnsaveResponse = await postData("/save/save-unsave", {
        social_id: socialId,
      });
      if (response.status) {
        toast.success(response.message);
      } else {
        throw new Error(response.message || "Failed to update bookmark status");
      }
    } catch (error) {
      dispatch(updateBookmarkStatus()); // Revert Redux state
      if (!previousState) return; // stop if not found

      setReels((prevReels) =>
        prevReels.map((r) =>
          r.social_id === socialId
            ? {
                ...r,
                isSaved: previousState.isSaved ?? r.isSaved,
                total_saves: previousState.total_saves ?? r.total_saves,
              }
            : r
        )
      );
    }
  };

  // Comment Count
  const commentAdded = useAppSelector(
    (state) => state.commentAdded.commentAdded
  );
  useEffect(() => {
    if (commentAdded && reel?.social_id) {
      dispatch(incrementCommentCount()); // Update Redux state
      setReels((prevReels) =>
        prevReels.map((r) =>
          r.social_id === reel.social_id
            ? {
                ...r,
                total_comments: (Number(r.total_comments) || 0) + 1,
              }
            : r
        )
      ); // Update Explore state
      dispatch(setCommentAddedFalse()); // Reset flag
    }
  }, [commentAdded, reel?.social_id, dispatch, setReels]);

  // useEffect(() => {
  //   const fetchReelDetails = async () => {
  //     if (!reel?.social_id) return;
  //     try {
  //       const response = await postData("/social/get-social", {
  //         social_id: reel.social_id,
  //       });
  //       if (response.status) {
  //         dispatch(setSelectedReel(response.data)); // ✅ update Redux with latest
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch reel details", err);
  //     }
  //   };
  //   fetchReelDetails();
  // }, [reel?.social_id]);

  if (!reel) return null;

  return (
    <Dialog
      open={Boolean(reel)}
      onClose={() => {
        dispatch(clearSelectedReel());
      }}
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
        <button
          onClick={() => dispatch(clearSelectedReel())}
          className="absolute top-1 right-2 text-dark text-sm z-50 cursor-pointer"
        >
          ✕
        </button>
        {/* Left video ================ */}
        <div className="sm:w-7/10 bg-dark relative sm:block hidden">
          {reel?.Media?.length > 0 ? (
            <video
              src={normalizeMediaUrl(reel.Media[0].media_location)}
              autoPlay
              muted
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white">
              No Media
            </div>
          )}
          <Image
            src="/home/play.png"
            alt="play"
            width={60}
            height={60}
            className="bg-dark bg-opacity-[30%] rounded-full p-4"
          />
        </div>
        {/* details and comment ============================== */}
        <div className="sm:w-1/2 flex flex-col max-h-[90vh]">
          <div className="px-6 pt-4 pr-4">
            {/* user name,profile and follow button ====================== */}
            <div className="flex justify-between place-items-center pr-6">
              {/*  */}
              <div className="flex items-center gap-3">
                <Image
                  src={normalizeMediaUrl(reel?.User?.profile_pic)}
                  alt={reel?.User?.user_name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <h2 className="text-base font-medium text-dark cursor-pointer" onClick={() => handleUserRoute(reel?.User?.user_id)}>
                  {reel?.User?.user_name}
                </h2>
              </div>
              {/* Follow Following button */}
              <button
                className={`cursor-pointer sm:w-[20%] p-1 rounded-xl ${
                  reel?.isFollowing
                    ? "bg-transparent border-main-green border text-main-green"
                    : "bg-main-green text-primary"
                }`}
                onClick={() => handleFollowUnfollow(reel?.User?.user_id)}
              >
                {reel?.isFollowing ? "Following" : "Follow"}
              </button>
            </div>
            <div className="text-sm my-4 text-gray-700">
              {reel.social_desc?.split(/(\s+)/).map((part, index) =>
                part.startsWith("#") ? (
                  <span
                    key={index}
                    className="text-main-green cursor-pointer"
                    onClick={() => {
                      dispatch(
                        setHashtag({
                          hashtag_name: part.replace("#", ""),
                          // count: total,
                        })
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
            <div className="flex gap-6 place-items-center mb-4">
              {/* total likes */}
              <div className="flex gap-1 items-center">
                <Image
                  src={
                    reel?.isLiked ? "/home/filled_heart.png" : "/home/like.png"
                  }
                  alt="like"
                  width={18}
                  height={18}
                  onClick={() =>
                    handleLike(reel?.social_id, reel?.User?.user_id)
                  }
                />
                <span className="sm:text-sm text-xs font-medium text-dark">
                  {reel?.total_likes} likes
                </span>
              </div>
              {/* total comments */}
              <div className="flex gap-1 items-center">
                <Image
                  src="/home/comment.png"
                  alt="comment"
                  width={18}
                  height={18}
                />
                <span className="sm:text-sm text-xs font-medium text-dark">
                  {reel?.total_comments} comments
                </span>
              </div>
              {/* total saves */}
              <div className="flex gap-1 items-center">
                <Image
                  src={
                    reel?.isSaved
                      ? "/home/filled_bookmark.png"
                      : "/home/bookmark.png"
                  }
                  alt="save"
                  width={18}
                  height={18}
                  className=""
                  onClick={() => handleBookmark(reel?.social_id)}
                />
                <span className="sm:text-sm text-xs font-medium text-dark">
                  {reel?.total_saves} saves
                </span>
              </div>
            </div>
          </div>
          <hr className="text-[#F0F0F0] w-full" />
          {/* Comments */}
          <div className=" flex-1 overflow-hidden ">
            <CommentBox />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ReelDetailsModal;
