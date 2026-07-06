"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Peer from "peerjs";

import { socketInstance } from "@/app/socket/socket";
import LoadingGlobal from "../LoadingGlobalt";
import { useLiveIdApi } from "@/app/store/api/useLiveIdApi";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { setSocketRoomId, toggleMute } from "@/app/store/Slice/uiSlice";
import { setViewStreamData } from "@/app/store/Slice/viewStreamSlice";
import { showModal } from "@/app/store/Slice/ModalsSlice";
import { FiGift, FiHeart, FiMessageSquare, FiShare2 } from "react-icons/fi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import ViewstreamingleftsideChatlist from "./ViewstreamingleftsideChatlist";
import { MdClose } from "react-icons/md";
import Viewstreamingrightside from "./Viewstreamingrightside";

const Viewstreamingcenter: React.FC = () => {
  const pathname = usePathname();
  const liveId = pathname?.split("/").pop();
  const liveUser = useAppSelector((s) => s.live.joinLiveResponse);
  const isMuted = useAppSelector((state) => state.ui.isMuted);
  const shareRef = useRef<HTMLDivElement>(null);
  const desktopChatRef = useRef<HTMLDivElement>(null);
  const giftsRef = useRef<HTMLDivElement>(null);

  /* ---------------- STATE ---------------- */
  const [showShare, setShowShare] = useState(false);
  const [showDesktopChat, setShowDesktopChat] = useState(false);
  const [showGiftsPanel, setShowGiftsPanel] = useState(false);

  const dispatch = useAppDispatch();
  const { fetchLive } = useLiveIdApi();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const retryTimeout = useRef<NodeJS.Timeout | null>(null);
  const socket = useRef(socketInstance()).current;

  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const liveRecords = useAppSelector((state) => state.viewStream.records[0]);




  const myUserId = Number(Cookies.get("Reelboost_user_id"));
  const shareUrl = `https://www.reelboost.com/live/${myUserId}`;

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















  // --- Fetch live data ---
  useEffect(() => {
    if (!liveId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchLive(liveId);
        const live = response?.data?.Records?.[0];
        if (!live) return;


        console.log("Live data fetched:@@@", response.data);

        dispatch(
          setViewStreamData({
            records: response.data.Records,
            pagination: response.data.Pagination,
          })
        );

        dispatch(setSocketRoomId(live.Live?.socket_room_id || null));
      } catch (err) {
        console.error("Error fetching live data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [liveId, dispatch]);

  // --- Update mute dynamically ---
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  // --- Create dummy media stream for PeerJS ---
  const createDummyStream = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const videoStream = canvas.captureStream();

    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const dst = audioCtx.createMediaStreamDestination();
    oscillator.connect(dst);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);

    videoStream.addTrack(dst.stream.getAudioTracks()[0]);
    return videoStream;
  }, []);

  const toggleVolume = useCallback(() => {
    dispatch(toggleMute());
  }, [dispatch]);
  // --- Initialize Peer connection ---
  const initializePeer = useCallback(() => {
    if (!liveRecords) return;

    const { peer_id: hostPeerId } = liveRecords;
    const socket_room_id = liveRecords.Live.socket_room_id;
    const user_id = liveRecords.User.user_id;
    if (!hostPeerId || !socket_room_id || !user_id) return;

    // Cleanup previous peer
    peerRef.current?.destroy();
    peerRef.current = new Peer({
      host: "peer.whoxachat.com",
      port: 443,
      secure: true,
      path: "/",
    });

    const peer = peerRef.current;

    peer.on("open", (viewerPeerId) => {
      socket.emit("join_live", { socket_room_id, user_id, peer_id: viewerPeerId });

      const dummyStream = createDummyStream();

      setTimeout(() => {
        if (!peer || peer.destroyed) return;

        const call = peer.call(hostPeerId, dummyStream);

        call.on("stream", (remoteStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = remoteStream;
            videoRef.current.play().catch(() => { });
          }
          setConnected(true);
        });

        call.on("close", handleRetry);
        call.on("error", (err) => {
          console.error("Call error:", err);
          handleRetry();
        });
      }, 1000);
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
      if (err.type === "peer-unavailable" || err.type === "network") handleRetry();
    });
  }, [liveRecords, createDummyStream, socket]);

  const handleRetry = useCallback(() => {
    setConnected(false);
    if (retryTimeout.current) clearTimeout(retryTimeout.current);
    retryTimeout.current = setTimeout(() => {
      initializePeer();
    }, 3000);
  }, [initializePeer]);

  // --- Trigger peer init when liveRecords changes ---
  useEffect(() => {
    if (liveRecords) initializePeer();

    return () => {
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
      peerRef.current?.destroy();
    };
  }, [liveRecords, initializePeer]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black/60">
        <LoadingGlobal />
      </div>
    );
  }


  const profilePic = liveRecords.User.profile_pic || "/default-avatar.png";
  const fullName = liveRecords.User.full_name || "Host Name";
  const userName = liveRecords.User.user_name || "username";




  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />


      {/* VIEWERS COUNT (MOBILE) */}
      {/* VIEWERS COUNT (MOBILE) */}
      <div className="absolute top-4 left-[60%] z-40 -translate-x-1/2 md:hidden">
        <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-4 py-1.5 border border-white/20">
          {/* Eye Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>

          {/* Viewer Count */}
          <span className="text-sm font-medium text-white">
            {liveUser?.curent_viewers ?? 0}
          </span>
        </div>
      </div>



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
          <div className={`hidden md:flex xl:hidden absolute top-4 right-4 z-50 ${showGiftsPanel ? "right-[64%]" : "right-4"}`}>
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


      <div className="absolute top-4 right-2 z-40 md:hidden flex gap-2">
        <button
          onClick={() => setShowShare((p) => !p)}
          className="p-2 rounded-full bg-black/40 border border-white/20 text-white hover:bg-main-green/20 transition"
        >
          <FiShare2 size={18} />
        </button>


        {/* Volume Toggle Button */}
        <button
          onClick={toggleVolume}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="p-2 rounded-full bg-black/40 border border-white/20 text-white hover:bg-main-green/20 transition"

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

      {/* Floating User Info */}
      <div
        className="absolute bottom-[92%] md:bottom-4 left-4 md:left-1/2 md:-translate-x-1/2 flex items-center gap-3
                     bg-gradient-to-b from-[#0a0a0f] to-[#111018] backdrop-blur-sm
                     border border-gray-700/50 px-4 py-2 rounded-xl md:rounded-full shadow-lg cursor-pointer z-10"
        // onClick={() => setOpenModal(true)}

        onClick={() => {
          dispatch(showModal("ViewstreamingcenterHosterDetail"));
        }}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30">
          <img src={profilePic} alt={userName} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col text-white text-sm">
          <span className="font-semibold">{fullName}</span>
          <span className="text-white/70">@{userName}</span>
        </div>
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
        <ViewstreamingleftsideChatlist />
      </div>


      {/* MOBILE CHAT (ALWAYS OPEN, NO BUTTONS) */}
      <div className="absolute bottom-0 left-0 w-full h-[46%] bg-black/30 overflow-y-auto md:hidden">
        <ViewstreamingleftsideChatlist />
      </div>


       {/* GIFTS PANEL */}
      <div
        ref={giftsRef}
        className={`
          hidden md:block absolute top-0 right-0 h-full w-[70%]
          bg-black/70 backdrop-blur-lg z-40
          transition-transform duration-500
          ${showGiftsPanel ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <Viewstreamingrightside />
      </div>

      {!connected && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
          <LoadingGlobal />
          <p className="text-white mt-4 text-sm animate-pulse">Connecting to stream...</p>
        </div>
      )}
    </div>
  );
};

export default Viewstreamingcenter;
