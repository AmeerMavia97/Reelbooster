"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { FiShare2, FiMessageSquare, FiHeart, FiGift } from "react-icons/fi";
import { MdStopCircle, MdClose } from "react-icons/md";


import { useLiveStream } from "@/app/context/LiveStreamContext";
import { showModal } from "@/app/store/Slice/ModalsSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";

import CommentListMainList from "../CommentList/CommentListMainList";
import LikesGiftsTabs from "../LikeGiftlist/LiveGiftlistman";
import toast from "react-hot-toast";

export default function StreamMain() {
  const { stream } = useLiveStream();
  const dispatch = useAppDispatch();

  const videoRef = useRef<HTMLVideoElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const desktopChatRef = useRef<HTMLDivElement>(null);
  const giftsRef = useRef<HTMLDivElement>(null);

  /* ---------------- STATE ---------------- */
  const [showShare, setShowShare] = useState(false);
  const [showDesktopChat, setShowDesktopChat] = useState(false);
  const [showGiftsPanel, setShowGiftsPanel] = useState(false);

  // 🔒 MOBILE CHAT ALWAYS OPEN (NO STATE)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const myUserId = Number(Cookies.get("Reelboost_user_id"));
  const shareUrl = `https://www.reelboost.com/live/${myUserId}`;

  const currentUser = useAppSelector(
    (state) => state.live.joinLiveResponse
  );

  /* ---------------- VIDEO ---------------- */
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  /* ---------------- OUTSIDE CLICK (DESKTOP ONLY) ---------------- */
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (window.innerWidth < 768) return;

    const target = e.target as Node;

    if (
      desktopChatRef.current &&
      !desktopChatRef.current.contains(target)
    ) {
      setShowDesktopChat(false);
    }

    if (giftsRef.current && !giftsRef.current.contains(target)) {
      setShowGiftsPanel(false);
    }

    if (shareRef.current && !shareRef.current.contains(target)) {
      setShowShare(false);
    }
  }, []);

  useEffect(() => {
    if (showDesktopChat || showGiftsPanel || showShare) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [showDesktopChat, showGiftsPanel, showShare, handleOutsideClick]);

  /* ---------------- ESC KEY (DESKTOP ONLY) ---------------- */
  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && window.innerWidth >= 768) {
        setShowDesktopChat(false);
        setShowGiftsPanel(false);
        setShowShare(false);
      }
    };

    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, []);

  /* ---------------- AUTO HIDE PANELS ON LARGE SCREENS ---------------- */
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 1024) { // Tailwind lg breakpoint
          setShowDesktopChat(false);
          setShowGiftsPanel(false);
        }
      };
      window.addEventListener("resize", handleResize);
      handleResize(); // run once
      return () => window.removeEventListener("resize", handleResize);
    }, []);


  /* COPY SHARE LINK */
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied! Share it 🚀");
  };
  

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* MOBILE VIEWERS */}
      <div className="absolute top-4 left-2 z-40 md:hidden">
        <div className="bg-black/40 px-4 py-1.5 rounded-full text-white text-sm">
          {currentUser?.curent_viewers ?? 0} Watching
        </div>
      </div>

      {/* MOBILE TOP ACTIONS */}
      <div className="absolute top-4 right-2 z-40 md:hidden flex gap-2">
        <button
            onClick={handleCopyLink}
          className="p-2 rounded-full bg-black/40 text-white"
        >
          <FiShare2 size={18} />
        </button>

        <button
          onClick={() => dispatch(showModal("StopLiveModal"))}
          className="p-2 rounded-full bg-red-600 text-white"
        >
          <MdStopCircle size={20} />
        </button>
      </div>

      {/* DESKTOP CHAT TOGGLE */}
       {/* CHAT ICON (DESKTOP) */}
            <div className={`hidden md:flex xl:hidden absolute z-50 ${showDesktopChat ? "top-4 left-[30%]" : "top-4 left-4"}`}>
              <button
                onClick={() => {
                  setShowDesktopChat((p) => !p);
                  setShowGiftsPanel(false);
                }}
                className="flex items-center gap-2 bg-black/70 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full shadow-md hover:bg-black/80 transition"
              >
                {showDesktopChat ? (
                  <>
                    <MdClose size={20} />
                    <span className="font-medium text-sm">Close Chat</span>
                  </>
                ) : (
                  <>
                    <FiMessageSquare size={20} />
                    <span className="font-medium text-sm">View Chat</span>
                  </>
                )}
              </button>
            </div>

      {/* GIFTS ICON (DESKTOP) */}
          <div className={`hidden md:flex xl:hidden absolute top-4 right-4 z-50 ${showGiftsPanel ? "right-[43%]" : "right-4"}`}>
            <button
              type="button"
              onClick={() => {
                setShowGiftsPanel((p) => !p);
                setShowDesktopChat(false);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-main-green/30 transition duration-300 shadow-lg"
            >
              {showGiftsPanel ? (
                <MdClose size={20} />
              ) : (
                <>
                  <FiHeart size={20} className="text-red-500" />
                  <FiGift size={20} className="text-yellow-400" />
                  <span className="font-semibold text-white text-sm">View Like | Gift</span>
                </>
              )}
            </button>
          </div>

      {/* DESKTOP CHAT PANEL */}
      <div
        ref={desktopChatRef}
        className={`
          hidden md:block absolute top-0 left-0 h-full w-1/2
          bg-black/70 backdrop-blur-lg z-40
          transition-transform duration-500
          ${showDesktopChat ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <CommentListMainList />
      </div>

      {/* MOBILE CHAT (ALWAYS OPEN, NO BUTTONS) */}
      <div className="absolute bottom-0 left-0 w-full h-[46%] bg-black/30 overflow-y-auto md:hidden">
        <CommentListMainList />
      </div>

      {/* GIFTS PANEL */}
      <div
        ref={giftsRef}
        className={`
          hidden md:block absolute top-0 right-0 h-full w-1/2
          bg-black/70 backdrop-blur-lg z-40
          transition-transform duration-500
          ${showGiftsPanel ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <LikesGiftsTabs />
      </div>

      {/* DESKTOP BOTTOM CONTROLS */}
      <div className="absolute bottom-0 left-0 w-full bg-black/50 px-4 py-3 hidden md:flex gap-4 z-30">
        <button
          onClick={() => dispatch(showModal("StopLiveModal"))}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg"
        >
          <MdStopCircle size={22} />
          Stop Live
        </button>

        <button
        onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-2 bg-main-green text-white py-3 rounded-lg"
        >
          <FiShare2 size={20} />
          Share Live
        </button>
      </div>

     
    </div>
  );
}
