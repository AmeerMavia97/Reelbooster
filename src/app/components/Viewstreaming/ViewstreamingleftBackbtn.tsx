"use client";

import { useAppSelector } from "@/app/utils/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { socketInstance } from "@/app/socket/socket";

function ViewstreamingleftBackbtn() {
  const router = useRouter();
                                                                                                                                                                                                                                                                                                                                                                        const liveUser = useAppSelector((s) => s.live.joinLiveResponse);
  const socketRoomId = useAppSelector((s) => s.ui.socket_room_id);

  const myUserId = Number(Cookies.get("Reelboost_user_id"));
  const socket = socketInstance();

  const hasLeftRef = useRef(false);

  /* ----------------------------------
     🚪 Emit leave_live (SAFE)
  ----------------------------------- */
  const emitLeaveLive = () => {
    if (hasLeftRef.current || !socket || !socketRoomId || !myUserId) return;

    socket.emit("leave_live", {
      socket_room_id: socketRoomId,
      user_id: myUserId,
    });

    hasLeftRef.current = true;

    console.log("🔴 Left live:", {
      socketRoomId,
      myUserId,
    });
  };

  /* ----------------------------------
     ❌ Handle tab close / refresh
  ----------------------------------- */
  useEffect(() => {
    const handleUnload = () => {
      emitLeaveLive();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      emitLeaveLive(); // ✅ cleanup on route change
    };
  }, []);

  return (
    <div className="absolute left-4 top-4 z-50">
      <div className="flex items-center gap-4 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md">

        {/* 🔙 Back Button */}
        <button
          onClick={() => {
            emitLeaveLive();
            router.back();
          }}
          className="p-2 sm:p-3 rounded-full bg-white/10 text-white cursor-pointer hover:bg-white/20 active:scale-95 transition-all backdrop-blur-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sm:w-6 sm:h-6"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>

        {/* 👀 Viewer Count */}
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sm:w-6 sm:h-6 opacity-80"
          >
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
          </svg>

          <span className="text-sm sm:text-base font-medium">
            {liveUser?.curent_viewers ?? 0}
          </span>
        </div>

      </div>
    </div>
  );
}

export default ViewstreamingleftBackbtn;
