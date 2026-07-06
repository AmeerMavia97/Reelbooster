"use client";
import React, { useRef, useEffect, useState, UIEvent } from "react";
import { Dialog, IconButton } from "@mui/material";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { hideModal, showModal } from "../../store/Slice/ModalsSlice";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { MusicListResponse, MusicRecord } from "../../types/ResTypes";
import Cookies from "js-cookie";
import { CiPlay1 } from "react-icons/ci";
import { GoArrowRight } from "react-icons/go";
import { setSelectedMusic } from "@/app/store/Slice/MediaSlice";
import { normalizeMediaUrlsDeep } from "@/app/utils/mediaUrl";

async function fetchMusic({
  pageParam,
}: {
  pageParam: number;
}): Promise<MusicListResponse> {
  const token = Cookies.get("Reelboost_auth_token");

  const { data } = await axios.post(
    `https://api.yeteneksat.com/api/music/get-music`,
    { page: pageParam },
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    }
  );
  return normalizeMediaUrlsDeep(data);
}

export default function MusicList() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.MusicList);
  const isTrimVideo = useAppSelector((state) => state.modals.TrimVideo);
  const isUploadReel = useAppSelector((state) => state.modals.UploadReel);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // 👇 Redux values
  const selectedMusic = useAppSelector((state) => state.media.selectedMusic);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["musicList"],
    queryFn: ({ pageParam = 1 }) => fetchMusic({ pageParam }),
    initialPageParam: 1,
   getNextPageParam: (lastPage) => {
  const pagination = lastPage?.data?.Pagination;

  if (!pagination) return undefined;

  const { current_page, total_pages } = pagination;

  return current_page < total_pages ? current_page + 1 : undefined;
},

  });
  

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load music on select
  useEffect(() => {
    if (selectedMusic && audioRef.current) {
      audioRef.current.src = selectedMusic.music_url;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay failed:", err);
          setIsPlaying(false);
        });
    }
  }, [selectedMusic]);

  // Handle select
  const handleSelectMusic = (music: MusicRecord) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    dispatch(setSelectedMusic(music));
  };

  // Play/pause toggle
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = "";
      setIsPlaying(false);
    } else {
      if (selectedMusic) {
        audioRef.current.src = selectedMusic.music_url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // ✅ Handle pagination via onScroll
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(hideModal("MusicList"))}
      fullWidth
      PaperProps={{
        sx: {
          overflow: "visible",
          borderRadius: 3,
          maxHeight: "90vh",
          width: "430px",
          maxWidth: "100%",
          position: "relative",
        },
      }}
      BackdropProps={{
        sx: { background: "#000000BD" },
      }}
    >
      <h2 className="text-lg text-primary bg-main-green rounded-t-lg text-center font-medium px-4 py-3">
        Add Music
      </h2>
      <button
        onClick={() => dispatch(hideModal("MusicList"))}
        className="absolute top-1 right-2 text-primary rounded-full p-2 transition cursor-pointer"
      >
        ✕
      </button>

      {status === "error" && (
        <p className="px-4 min-h-52 flex justify-center items-center">
          Failed to load music
        </p>
      )}

      <div
        className={`flex flex-col gap-3 max-h-[65vh] overflow-y-auto px-4 py-2 ${
          selectedMusic ? "pb-16" : ""
        }`}
        id="music-scroll-container"
        ref={scrollContainerRef}
        onScroll={handleScroll} // ✅ trigger pagination
      >
        {data?.pages.map((page) =>
          (page as MusicListResponse).data?.Records.map((music: MusicRecord) => (
            <div
              key={music.music_id}
              className="flex gap-3 items-center cursor-pointer hover:bg-border-gray p-2 rounded-lg"
              onClick={() => handleSelectMusic(music)}
            >
              <Image
                src={music.music_thumbnail}
                alt={music.music_title}
                width={54}
                height={54}
                className="rounded-lg object-cover"
              />
              <div>
                <p className="font-medium text-xs max-w-[270px] line-clamp-2">
                  {music.music_title}
                </p>
                <p className="text-[10px] text-main-green">
                  {music.music_desc}
                </p>
              </div>
            </div>
          ))
        )}

        {isFetchingNextPage && (
          <div className="h-10 flex justify-center items-center">
            <p>Loading more...</p>
          </div>
        )}
      </div>

      {/* Mini Player */}
      {selectedMusic && (
        <div className="absolute bottom-0 left-0 w-full bg-main-green rounded-tr-4xl px-4 py-2 flex items-center gap-3">
          <Image
            src={selectedMusic.music_thumbnail}
            alt={selectedMusic.music_title}
            width={55}
            height={55}
            className="rounded-lg object-cover"
          />
          <div className="flex-1">
            <p className="text-xs text-primary font-medium line-clamp-2 max-w-[250px]">
              {selectedMusic.music_title}
            </p>
            <p className="text-[10px] text-primary truncate">
              {selectedMusic.music_desc}
            </p>
          </div>

          <div className="flex gap-2 place-items-center">
            <IconButton onClick={togglePlayPause}>
              {isPlaying ? (
                <Image
                  src="/ReelBoost/pause.png"
                  alt="pause"
                  width={28}
                  height={28}
                />
              ) : (
                <CiPlay1 size={28} className="text-primary" />
              )}
            </IconButton>
            <audio ref={audioRef} />
            <div
              className="rounded-full w-8 h-8 bg-primary flex place-items-center justify-center cursor-pointer"
              onClick={() => {
                if (isTrimVideo || isUploadReel) {
                  dispatch(hideModal("MusicList"));
                } else {
                  dispatch(showModal("UploadReel"));
                  dispatch(hideModal("MusicList"));
                }
              }}
            >
              <GoArrowRight className="text-main-green text-base" />
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
  
