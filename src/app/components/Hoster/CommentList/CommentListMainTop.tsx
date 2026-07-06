"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/utils/hooks";
import { socketInstance } from "@/app/socket/socket";
import { useLiveStream } from "@/app/context/LiveStreamContext";

function CommentListMainTop() {
  const router = useRouter();
  const socket = socketInstance();
  const { leaveStream } = useLiveStream();

  const socketRoomId = useAppSelector(
    (state) => state.live.lives?.[0]?.socket_room_id
  );

  const currentUser = useAppSelector(
    (state) => state.live.joinLiveResponse
  );

  const hasStoppedRef = useRef(false);

  /** 🛑 Stop live (safe single emit) */
  const stopLive = useCallback(() => {
    if (hasStoppedRef.current || !socketRoomId) return;

    socket.emit("stop_live", {
      socket_room_id: socketRoomId,
    });

    hasStoppedRef.current = true;
    console.log("🛑 stop_live emitted");
  }, [socketRoomId, socket]);

  /** 🔄 Handle tab close / refresh */
  useEffect(() => {
    const handleUnload = () => stopLive();
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [stopLive]);

  /** 👀 Handle tab switch / minimize */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopLive();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [stopLive]);

  return (
    <div className="absolute left-4 top-4 z-50">
      <div className="flex items-center gap-4 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md">

        {/* 🔙 Back Button */}
        <button
          onClick={() => {
            stopLive();     // 🛑 socket event
            leaveStream();  // 🎥 stop camera + peer
            router.back();  // 🔙 navigate
          }}
          className="p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>

        {/* 👀 Viewer Count */}
        <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 shadow-sm border border-white/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>

          <span className="text-sm font-medium text-white">
            {currentUser?.curent_viewers ?? 0}
          </span>

          <span className="text-xs text-gray-300">Watching</span>
        </div>

      </div>
    </div>
  );
}

export default CommentListMainTop;
