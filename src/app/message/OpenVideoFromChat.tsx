"use client";
import React, { useRef, useState } from "react";
import { useAppDispatch } from "../utils/hooks";
import { hideModal } from "../store/Slice/ModalsSlice";
import Image from "next/image";
import { normalizeMediaUrl } from "../utils/mediaUrl";

function OpenVideoComponent({ url }:{url:string}) {

  const dispatch = useAppDispatch();
  const mediaUrl = normalizeMediaUrl(url);

  const handleCloseModal = () => {
    dispatch(hideModal("OpenVideoFromChat"));
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        setShowControls(false); // Hide immediately when playing
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowControls(true); // Show controls when paused
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-dark/[0.60] backdrop-blur-sm z-1000">
        <button
          onClick={handleCloseModal}
          className="absolute top-0 cursor-pointer text-2xl right-1 text-primary rounded-full p-2 transition"
        >
          ✕
        </button>
        <div className=" rounded-2xl shadow-xl w-[50%] h-[80%] relative">
          {/* For the Image open */}
          <div className="w-full h-full rounded-2xl relative">
            <video
              src={mediaUrl}
              ref={videoRef}
              className="w-full h-full object-cover rounded-2xl cursor-pointer"
              width={50}
              autoPlay
              loop
              height={50}
              onClick={handleVideoClick}
            />

            {!isPlaying && showControls && (
              <div className="absolute inset-0 flex justify-center items-center">
                <button
                  onClick={handleVideoClick}
                  className="p-4  backdrop-blur-md rounded-full"
                >
                  <Image
                    src={isPlaying ? "/chat/Pause.png" : "/chat/play.png"}
                    alt="play_pause"
                    height={20}
                    width={20}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default OpenVideoComponent;
