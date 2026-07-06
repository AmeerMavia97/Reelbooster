"use client";

import React, { useCallback } from "react";
import ShareStrambtn from "./ShareStrambtn";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { toggleMute } from "@/app/store/Slice/uiSlice";

const Viewstreamingrightsidebtn: React.FC = () => {
  const dispatch = useAppDispatch();
  const isMuted = useAppSelector((state) => state.ui.isMuted);

  const toggleVolume = useCallback(() => {
    dispatch(toggleMute());
  }, [dispatch]);

  const path = usePathname();
  const segments = path.split("/").filter(Boolean);
  const lastValue = segments[segments.length - 1];

  return (
    <div className="absolute right-5 top-2 flex flex-col gap-5 max-h-[85vh] overflow-y-auto scrollbar-hide">
      <div className="w-fit flex items-center gap-5">
        <ShareStrambtn
          url={`http://localhost:3000/live/${lastValue}`}
          title="Live Streaming 🔴 Join now!"
        />

        {/* Volume Toggle Button */}
        <button
          onClick={toggleVolume}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 
          transition-all backdrop-blur-sm cursor-pointer"
        >
          {!isMuted ? (
            /* Volume ON */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M11 5L6 9H3v6h3l5 4V5z" />
              <path d="M16 9a5 5 0 010 6" />
              <path d="M19 7a9 9 0 010 10" />
            </svg>
          ) : (
            /* Volume MUTE */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M11 5L6 9H3v6h3l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Viewstreamingrightsidebtn;
