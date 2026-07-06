"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HiChevronUp, HiChevronDown } from "react-icons/hi2";

import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { showModal } from "../store/Slice/ModalsSlice";
import { setHashtag, setUserId } from "../store/Slice/UserIdHashtagIdSlice";
import { setActiveReelId } from "../store/Slice/ActiveCommentBox";

import ActionButtons from "./ActionButtons";
import ReelSkeleton from "../components/Shimmer/ReelSkeleton";

import useApiPost from "../hooks/postData";
import { Pagination, SocialMediaResponse, SocialRecord } from "../types/Reels";
import formatDateTime from "../components/formatDates/DateMonthTime";
import {
  resetReelsRefresh,
} from "../store/Slice/fetchFollowReelsSlice";
import DeleteSocial from "./DeleteSocial";
import { toast } from "react-toastify";
import { setMusicData } from "../store/Slice/ViewAudioSlice";

function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const token = Cookies.get("Reelboost_auth_token");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const MyUserId = Cookies.get("Reelboost_user_id");

  const [reels, setReels] = useState<SocialRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const isUploadVideoOpen = useAppSelector((state) => state.modals.UploadVideo);

  console.log("Reels Count:", reels[0]?.Media);

  const [expandedCaptions, setExpandedCaptions] = useState<{
    [key: string]: boolean;
  }>({});

  const { postData } = useApiPost();

  const toggleCaption = (id: number) => {
    setExpandedCaptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const refreshReels = useAppSelector((state) => state.follow.refreshReels);
  const followingCount = useAppSelector(
    (state) => state.followFollowingSlice.followingCount
  );
  const fetchReels = async (
    pageNumber: number,
    fetchFollowingOnly = followingCount > 0 // default to followers if available
  ) => {
    setIsLoading(true);

    try {
      let endpoint = "";
      let body = {};

      if (fetchFollowingOnly) {
        endpoint = "/social/get-social-of-followers";
        body = token
          ? { page: pageNumber }
          : { order: "random", page: pageNumber };
      } else {
        endpoint = token ? "/social/get-social" : "/social/get-social-noauth";
        body = token
          ? { social_type: "reel", page: pageNumber }
          : { order: "random", page: pageNumber };
      }

      const res: SocialMediaResponse = await postData(endpoint, body);

      if (res?.status) {
        // If result from followers endpoint is empty AND user is following no one, fallback
        if (
          fetchFollowingOnly &&
          res.data.Records.length === 0 &&
          followingCount === 0
        ) {
          fetchReels(1, false); // fallback to public reels
          return;
        }

        setReels((prev) =>
          pageNumber === 1 ? res.data.Records : [...prev, ...res.data.Records]
        );
        setPagination(res.data.Pagination);
        setPage(pageNumber);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (refreshReels) {
      fetchReels(1, true);
      dispatch(resetReelsRefresh());
    }
  }, [refreshReels, dispatch]);

  useEffect(() => {
    if (!refreshReels) {
      fetchReels(1); // Default initial fetch
    }
  }, []);

  // route to user profile ============
  const handleUserRoute = (userId: number) => {
    if (!token) {
      dispatch(showModal("Signin"));
    } else {
      dispatch(setUserId(userId));
      router.push(`/profile/${userId}`);
    }
  };

  // view audio =============

  // Follow Unfollow
  const handleFollowUnfollow = async (userId: number, isFollowed: boolean) => {
    if (!token) {
      dispatch(showModal("Signin"));
    } else {
      try {
        // 🔹 Update UI immediately (optimistic)
        setReels((prev) =>
          prev.map((r) =>
            r.user_id === userId ? { ...r, isFollowing: !isFollowed } : r
          )
        );

        // 🔹 Call API
        const res = await postData("/follow/follow-unfollow", {
          user_id: userId,
        });

        if (res.status) {
          toast.success(res.message);
        } else {
          // 🔹 If API failed, revert UI
          setReels((prev) =>
            prev.map((r) =>
              r.user_id === userId ? { ...r, isFollowing: isFollowed } : r
            )
          );
          toast.error(res.message || "Failed to update follow status");
        }
      } catch (error) {

        // 🔹 Revert UI on error
        setReels((prev) =>
          prev.map((r) =>
            r.user_id === userId ? { ...r, isFollowing: isFollowed } : r
          )
        );

        toast.error("Something went wrong");
      }
    }
  };

  // 🔁 Setup observer for auto-play
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const observeReels = useCallback(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          const video = entry.target.querySelector("video") as HTMLVideoElement;

          if (entry.isIntersecting) {
            video?.play();
            setCurrentIndex(index);
            setPlayingIndex(index);

            const visibleReel = reels[index];
            if (visibleReel) {
              // ✅ Dispatch active reel
              dispatch(
                setActiveReelId({
                  activeReelId: visibleReel.social_id,
                  activeReelUserId: visibleReel.user_id,
                })
              );

              // ✅ Call add-views API here
              postData("/social/add-views", {
                social_ids: visibleReel.social_id,
              });
            }

            // fetch more reels when near end
            if (
              index >= reels.length - 2 &&
              pagination &&
              page < pagination.total_pages &&
              !isLoading
            ) {
              fetchReels(page + 1);
            }
          } else {
            video?.pause();
          }
        });
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.8,
      }
    );

    videoRefs.current.forEach((ref) => {
      if (ref) observer.current?.observe(ref);
    });
  }, [reels, pagination, page, isLoading]);

  useEffect(() => {
    observeReels();
  }, [reels, observeReels]);

  // handle volume of reel =============================
  useEffect(() => {
    videoRefs.current.forEach((ref) => {
      const video = ref?.querySelector("video") as HTMLVideoElement | null;
      if (video) {
        video.muted = muted;
      }
    });
  }, [muted, reels]);

  // Always mute when upload modal is open
  useEffect(() => {
    if (isUploadVideoOpen) {
      setMuted(true);
    }
  }, [isUploadVideoOpen]);

  if (isLoading && reels.length === 0) {
    // Loading state with no data yet
    return (
      <>
        {Array(3)
          .fill(0)
          .map((_, idx) => (
            <ReelSkeleton key={idx} />
          ))}
      </>
    );
  }

  // Add views ===============

  if (!isLoading && reels.length === 0) {
    // Only show empty state when loading is done
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Image src="/home/Empty.png" width={30} height={30} alt="empty" />
        <h2 className="text-base font-semibold text-dark">No Reels</h2>
        <p className="text-sm mt-1 text-center text-gray">
          No Reels to show. Start following other users.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-screen w-full bg-[#F6F9FB]">
        <div
          className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          ref={scrollContainerRef}
        >
          {reels.map((reel, index) => (
            <div
              key={reel.social_id}
              ref={(el) => { videoRefs.current[index] = el; }}
              data-index={index}
              className="relative h-screen snap-start flex justify-center gap-4 items-center"
            >
              <div className="relative w-full h-screen  overflow-hidden bg-dark md:max-w-lg">
                {/* 🎥 Video */}
                <video
                          src={
    reel?.Media?.find(m => m?.is_original)?.media_location
  }
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  onClick={(e) => {
                    const video = e.currentTarget;
                    if (video.paused) {
                      video.play();
                      setPlayingIndex(index);
                    } else {
                      video.pause();
                      setPlayingIndex(null);
                    }
                  }}
                />

                {/* Mute button */}
                <button
                  onClick={() => setMuted((prev) => !prev)}
                  className="absolute cursor-pointer sm:bottom-4 bottom-12 sm:right-4 right-3 bg-dark/50 text-primary p-2 text-xs rounded-full z-20"
                >
                  <Image
                    src={muted ? "/home/muted.png" : "/home/unmuted.png"}
                    height={20}
                    width={20}
                    alt="muted"
                  />
                </button>

                {/* Overlay Play Icon */}
                {playingIndex !== index && (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      const video = videoRefs.current[index]?.querySelector(
                        "video"
                      ) as HTMLVideoElement;
                      if (video) {
                        video.play();
                        setPlayingIndex(index);
                      }
                    }}
                  >
                    <Image
                      src="/home/play.png"
                      alt="play"
                      width={60}
                      height={60}
                      className="bg-dark/[0.3] rounded-full p-4"
                    />
                  </div>
                )}

                {/* 📃 Caption + Username */}
                <div
                  className="absolute md:bottom-0 pb-6 bottom-9 left-0 px-4 text-primary w-full space-y-2
                bg-gradient-to-t  from-[#000000cc] via-[#00000080] to-transparent z-10"
                >
                  <div className="flex items-center gap-2 mb-4">
                    {/* username and music ======= */}
                    <div className="flex flex-col ">
                      <span
                        className="cursor-pointer text-sm inline-block drop-shadow"
                        onClick={() => handleUserRoute(reel.User.user_id)}
                      >
                        {reel.User.user_name}
                      </span>
                      {/* music */}
                      {reel.Music != null && (
                        <>
                          <div className="flex gap-1 place-items-center">
                            <Image
                              src="/ReelBoost/AddMusic.png"
                              alt="music"
                              height={0}
                              width={10}
                              className="w-3 h-3"
                            />
                            <span
                              className="cursor-pointer text-xs gap-2 inline-block drop-shadow max-w-[190px] truncate"
                              onClick={() => {
                                if (!token) {
                                  dispatch(showModal("Signin"));
                                } else {
                                  dispatch(showModal("ViewAudio"));
                                  dispatch(
                                    setMusicData({
                                      musicId: reel.Music?.music_id,
                                      musicName: reel?.Music?.music_title,
                                      musicImage: reel?.Music?.music_thumbnail,
                                      total_socials: reel?.Music?.total_use,
                                    })
                                  );
                                }
                              }}
                            >
                              {reel.Music?.music_title}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    {/* Follow Following button */}
                    {reel.user_id != Number(MyUserId) && (
                      <button
                        onClick={() =>
                          handleFollowUnfollow(
                            reel.user_id,
                            reel.isFollowing === true
                          )
                        }
                        className={`cursor-pointer text-[12px] text-primary rounded-xl font-normal inline-block drop-shadow w-16 py-1.5 ${
                          reel.isFollowing === true
                            ? "border border-primary"
                            : "bg-main-green"
                        }`}
                      >
                        {reel.isFollowing === true ? "Following" : "Follow"}
                      </button>
                    )}
                  </div>

                  {/* Caption */}
                  {reel?.social_desc != "" && 
                  
                  
                  <div className="text-sm text-primary pointer-events-auto max-w-[80%] md:max-w-[24rem]">
                    <p
                      className={`leading-tight drop-shadow ${
                        expandedCaptions[reel.social_id] ? "" : "line-clamp-1"
                      } transition-all duration-200`}
                    >
                      {reel.social_desc.split(/(\s+)/).map((part, index) =>
                        part.startsWith("#") ? (
                          <span
                            key={index}
                            className="text-main-green cursor-pointer"
                            onClick={() => {
                              dispatch(
                                setHashtag({
                                  hashtag_name: part.replace("#", ""), // 👈 get clicked hashtag
                                  // count: total,
                                })
                              );
                              router.push("/explore");
                            }}
                          >
                            {part}
                          </span>
                        ) : (
                          part
                        )
                      )}
                    </p>

                    {reel.social_desc?.length > 100 && (
                      <button
                        className="text-[#ABABAB] text-xs font-medium cursor-pointer"
                        onClick={() => toggleCaption(reel.social_id)}
                      >
                        {expandedCaptions[reel.social_id] ? "less" : "more"}
                      </button>
                    )}
                  </div> }

                  {/* Date and Location */}
                  <div className="flex gap-2 place-items-center">
                    {/* Date */}
                    <div className="flex gap-1 place-items-center">
                      <Image
                        src="/home/calendar.png"
                        alt="calendar"
                        width={16}
                        height={16}
                      />
                      <p className="text-[12px] drop-shadow">
                        {formatDateTime(reel.createdAt)}
                      </p>
                    </div>

                    {reel.location && (
                      <>
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {/* Loc */}
                        <div className="flex gap-1 place-items-center max-w-[250px]">
                          <Image
                            src="/home/locationW.png"
                            alt="location"
                            width={16}
                            height={16}
                          />
                          <p className="text-[12px] drop-shadow truncate">
                            {reel?.location}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 🎛 Action Buttons → On phone floats right side, on desktop stays outside */}
                <div className="absolute right-2 sm:top-1 -top-28 flex flex-col gap-4 z-20 md:hidden">
                  <ActionButtons
                    reel={reel}
                    setReels={setReels}
                    user_id={reel.User.user_id}
                  />
                </div>
              </div>

              {/* 🖥️ Desktop Action Buttons (outside reel box) */}
              <div className="hidden md:block">
                <ActionButtons
                  reel={reel}
                  setReels={setReels}
                  user_id={reel.User.user_id}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Controls */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 hidden z-50 md:flex flex-col gap-4">
          <button
            onClick={() =>
              videoRefs.current[currentIndex - 1]?.scrollIntoView({
                behavior: "smooth",
              })
            }
            disabled={currentIndex === 0}
            className="bg-dark/[0.08] p-2 rounded-full cursor-pointer"
          >
            <HiChevronUp className="text-dark text-xl" />
          </button>
          <button
            onClick={() =>
              videoRefs.current[currentIndex + 1]?.scrollIntoView({
                behavior: "smooth",
              })
            }
            disabled={currentIndex === reels.length - 1}
            className="bg-dark/[0.08] p-2 rounded-full cursor-pointer"
          >
            <HiChevronDown className="text-dark text-xl" />
          </button>
        </div>
      </div>
      <DeleteSocial setReels={setReels} />
    </>
  );
}

export default Home;
