// components/GoToliveModal.tsx
"use client";

import {
  Dialog,
  IconButton,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import LiveLikeCommentLiveHostUser from "./LiveLikeCommentLiveHostUser";
import { IoCloseCircleOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import Image from "next/image";
import { AiOutlineEye } from "react-icons/ai";
import Confetti from "react-confetti";
import { useAppSelector } from "../utils/hooks";
import { useUserProfile } from "../store/api/updateUser";

interface Props {
  open: boolean;
  stream: MediaStream | null;
  onLeave: () => void;
}

export default function GoToliveModal({ open, stream, onLeave }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);


  console.log("GoToliveModal stream:@@!@!@@@@!!!!!!!!```", stream);

  const currentUser = useAppSelector(
    (state) => state.live.joinLiveResponse
  );

  const ReviceGiftvalues = useAppSelector((state) => state.gifts.gifts);

  const matchedGiftUser =
    ReviceGiftvalues?.find(
      (item) => item.user_id === currentUser?.User?.user_id
    );

  const currentlike = useAppSelector((state) => state.live.liveEvents);
  const totalLikes = currentlike?.filter(item => item.like).length ?? 0;

  const handleConfirmLeave = () => {
    setConfirmOpen(false);
    onLeave();
  };

  /* ================= VIDEO SETUP ================= */
  useEffect(() => {
    if (!open || !stream || !videoRef.current) return;

    const video = videoRef.current;
    video.muted = true;
    video.srcObject = stream;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        setTimeout(() => video.play().catch(() => { }), 300);
      }
    };

    const timer = setTimeout(playVideo, 50);
    return () => clearTimeout(timer);
  }, [open, stream]);

  const handleCloseClick = () => setConfirmOpen(true);
  const handleCancelLeave = () => setConfirmOpen(false);

  const token = Cookies.get("Reelboost_auth_token");
  const { data: userData } = useUserProfile(token ?? "");

  /* ================= GIFT POPUP + CONFETTI ================= */
  const gift = useAppSelector((state) => state.gifts.gifts);

  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [latestGift, setLatestGift] = useState<any>(null);

  useEffect(() => {
    if (!gift || gift.length === 0) return;

    const lastGift = gift[gift.length - 1];

    setLatestGift(lastGift);
    setShowGiftPopup(true);

    const timer = setTimeout(() => setShowGiftPopup(false), 5000);
    return () => clearTimeout(timer);
  }, [gift]);

  const [confetti, setConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const onResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (showGiftPopup) {
      setConfetti(true);

      const timer = setTimeout(() => setConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showGiftPopup]);

  return (
    <>
      {/* ================= LIVE MODAL ================= */}
      <Dialog
        open={open}
        hideBackdrop
        keepMounted
        PaperProps={{
          sx: {
            backgroundColor: "black",
            borderRadius: "14px",
            width: 1000,
            height: 800,
            maxWidth: "none",
            overflow: "hidden",
            position: "relative",
          },
        }}
        sx={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >

        {/* CLOSE BUTTON */}
        <div className="absolute top-1 right-2 z-[2000]">
          <IconButton
            onClick={handleCloseClick}
            size="small"
            sx={{
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              backdropFilter: "blur(6px)",
              width: 36,
              height: 36,
              "&:hover": { backgroundColor: "rgba(255,0,0,0.85)" },
            }}
          >
            <IoCloseCircleOutline size={22} />
          </IconButton>
        </div>

        {/* 🎉 FULLSCREEN CONFETTI INSIDE MODAL */}
        {confetti && (
          <div className="absolute inset-0 pointer-events-none z-[1800]">
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              numberOfPieces={350}
              gravity={0.5}
              recycle={false}
            />
          </div>
        )}

        {/* 🎁 GIFT POPUP INSIDE MODAL */}
        {showGiftPopup && latestGift && matchedGiftUser && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-5   border border-gray-400 rounded-xl backdrop-blur-md shadow-lg flex items-center gap-4 animate-bounce z-[1900]">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">🎁 New Gift Received!</p>
              <p className="text-sm text-gray-300">
                From: {currentUser?.User?.full_name || currentUser?.User?.user_name}
              </p>
            </div>

            {currentUser?.User?.profile_pic && (
              <Image
                src={currentUser.User.profile_pic}
                alt="user profile picture"
                width={50}
                height={50}
                className="rounded-full border-2 border-white"
              />
            )}
          </div>

        )}

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex h-full w-full md:flex-row flex-col relative">

          {/* LEFT: LIVE VIDEO */}
          <div className="relative w-full md:w-1/2 h-full bg-black">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full h-full object-cover"
            />

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                LIVE
              </span>
            </div>
          </div>

          {/* RIGHT: COMMENTS / LIKES */}
          <div className="relative w-full md:w-1/2 h-full flex flex-col">

            {/* USER HEADER */}
            <div className="w-full mt-6 flex items-center justify-between py-3 bg-black/60 backdrop-blur-md rounded-xl border">

              {/* LEFT : PROFILE */}
              <div className="flex items-center pl-4 gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
                  <Image
                    src={userData?.data.profile_pic || "/avatar.jpg"}
                    alt="profile"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-white truncate max-w-[140px]">
                    {userData?.data.first_name} {userData?.data.last_name}
                  </p>
                </div>
              </div>

              {/* RIGHT : STATS */}
              <div className="flex bg-[#232323] items-center py-1 rounded-l-lg gap-3">

                {/* Likes */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white">
                  <Image
                    src="/SidebarIcons/heart.png"
                    alt="heart"
                    width={12}
                    height={12}
                  />
                  <span className="font-medium">{totalLikes}</span>
                </div>

                {/* Views */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white">
                  <AiOutlineEye size={14} />
                  <span className="font-medium">
                    {currentUser?.curent_viewers ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* COMMENTS AREA */}
            <div className="absolute bottom-0 w-full">
              <LiveLikeCommentLiveHostUser />
            </div>
          </div>
        </div>
      </Dialog>

      {/* ================= LEAVE CONFIRM MODAL ================= */}
      <Dialog
        open={confirmOpen}
        onClose={handleCancelLeave}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 6, padding: 0, overflow: "hidden" },
        }}
      >
        <div className="w-full bg-white px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900 text-center">
            Leave Live Stream?
          </h2>

          <div className="my-4 h-px w-full bg-gray-200" />

          <p className="text-sm leading-relaxed text-gray-600 text-center px-2">
            Are you sure you want to leave the live stream?
            <br />
            <span className="text-gray-500">
              Your viewers will be disconnected immediately.
            </span>
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleCancelLeave}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Stay
            </button>

            <button
              onClick={handleConfirmLeave}
              className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition"
            >
              Leave
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
