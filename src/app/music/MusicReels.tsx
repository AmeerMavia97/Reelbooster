"use client";
import React, { useEffect, useCallback } from "react";
import { RiHeart3Line } from "react-icons/ri";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import Image from "next/image";
import { setSelectedReel } from "../store/Slice/SelectedReelDetail";
import {
  setActiveCommentPostId,
  setActiveUserId,
} from "../store/Slice/ActiveCommentBox";
import { appendReels, setPagination } from "../store/Slice/ViewAudioSlice";
import ReelDetailsModal from "../explore/SelectedReelModal";
import useApiPost from "@/app/hooks/postData";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useRouter } from "next/navigation";
import { Reel } from "../types/Reels";

function MusicReels() {
  const dispatch = useAppDispatch();
  const { reels, musicName, musicImage, currentPage, totalPages } =
    useAppSelector((state) => state.music);
  const MusicId = useAppSelector((state) => state.music.musicId);
  const { postData } = useApiPost();
  const router = useRouter();

  // fetch next page
  const loadMore = useCallback(async () => {
    if (!MusicId || currentPage >= totalPages) return;
    try {
      const payload = {
        social_type: "reel",
        page: currentPage + 1,
        music_id: MusicId,
      };
      const response = await postData("/social/get-social", payload);
      if (response?.status) {
        dispatch(appendReels(response.data.Records));
        dispatch(
          setPagination({
            currentPage: response.data.Pagination.current_page,
            totalPages: response.data.Pagination.total_pages,
          })
        );
      }
    } catch (err) {
    }
  }, [MusicId, currentPage, totalPages, postData, dispatch]);

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (bottom) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  return (
    <>
      <div className="py-4 px-4 2xl:px-0 mb-10">
        <div className="py-4 px-4 2xl:px-0 mb-10">
          {/* Header Row */}
          <div className="flex items-center gap-3 py-3">
            {/* Fixed-width arrow */}
            <div className="w-8">
              <MdKeyboardArrowLeft
                className="text-dark text-2xl cursor-pointer"
                onClick={() => router.push("/")}
              />
            </div>

            {/* Title area (flex-grow) */}
            <div className="flex items-center gap-3">
              <Image
                src={musicImage || "/profile/default.png"}
                alt={musicName || "Music"}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
              <p className="text-dark text-sm font-medium">{musicName}</p>
            </div>
          </div>

          {/* Reels Grid - aligned with title, not arrow */}
          <div className="ml-12">
            {" "}
            {/* Same width as the arrow */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 xl:grid-cols-4 gap-4 py-4">
              {reels.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-32 col-span-full">
                  <Image
                    src="/profile/NoReels.png"
                    alt="no reels"
                    width={80}
                    height={80}
                  />
                  <p className="text-dark text-[11px] text-center font-normal max-w-3xs">
                    No reels found for this audio
                  </p>
                </div>
              ) : (
                reels.map((reel, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-1 cursor-pointer"
                    onClick={() => {
                      dispatch(setSelectedReel(reel));
                      dispatch(setActiveCommentPostId(reel.social_id));
                      dispatch(setActiveUserId(reel.User.user_id));
                    }}
                  >
                    <div className="relative rounded-lg overflow-hidden h-[250px] bg-dark">
                      <video
                        src={reel.Media[0]?.media_location}
                        className="h-full w-full object-cover"
                        playsInline
                        autoPlay
                        muted
                        loop
                      />
                      <div className="absolute bottom-0 left-0 w-full h-[70px] bg-gradient-to-t from-dark via-dark/40 to-transparent z-10" />
                      <div className="flex gap-1 place-items-center absolute bottom-3 left-3 z-20">
                        <RiHeart3Line />
                        <p className="text-primary font-medium text-xs">
                          {reel.total_likes}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 place-items-center cursor-pointer">
                      <Image
                        src={reel.User.profile_pic}
                        className="w-5.5 h-5.5 rounded-full object-cover"
                        alt={reel.User.user_name}
                        width={22}
                        height={22}
                      />
                      <p className="text-dark text-[12px]">
                        {reel.User.user_name}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Optional loading indicator */}
          {currentPage < totalPages && (
            <p className="text-center text-gray text-sm py-4">
              Loading more...
            </p>
          )}
        </div>
      </div>

      <ReelDetailsModal setReels={function (value: React.SetStateAction<Reel[]>): void {
        throw new Error("");
      } } />
    </>
  );
}

export default MusicReels;
