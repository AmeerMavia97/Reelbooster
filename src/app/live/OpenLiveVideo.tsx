"use client";

import { useEffect, useRef } from "react";
import { Dialog, IconButton } from "@mui/material";
import Cookies from "js-cookie";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineEye } from "react-icons/ai";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { socketInstance } from "../socket/socket";
import useApiPost from "../hooks/postData";
import { hideModal } from "../store/Slice/ModalsSlice";
import { clearLiveEvents, clearSelectedLive } from "../store/Slice/LiveSlice";
import { IoCloseCircleOutline } from "react-icons/io5";
import DemoLiveVideo from "../components/DemoLiveVideo";
import PeerVideoPlayer from "../components/PeerVideoPlayer";
import LiveLikeComment from "./LiveLikeComment";

export default function OpenLiveVideo() {
  const dispatch = useAppDispatch();
  const socket = socketInstance();

  const { postData, loading } = useApiPost();

  const open = useAppSelector((s) => s.modals.LivePopup);
  const selectedLive = useAppSelector((s) => s.live.selectedLive);
  const socketRoomId = useAppSelector((s) => s.live.socket_room_id);
  const liveUser = useAppSelector((s) => s.live.joinLiveResponse);
  const activeResponse = useAppSelector((s) => s.live.liveEvents);

  const myUserId = Number(Cookies.get("Reelboost_user_id"));
  const hasLeftRef = useRef(false);


  const handleFollow = async () => {
    try {
      const res = await postData("/follow/follow-unfollow", {
        user_id: myUserId,
      });

      toast.success(res?.message || "Updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

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
   ❌ Close modal handler
  ----------------------------------- */
  const handleClose = () => {
    emitLeaveLive();
    dispatch(hideModal("LivePopup"));
    dispatch(clearSelectedLive());
    dispatch(clearLiveEvents());
  };

  /* ----------------------------------
   🔥 Handle tab close / refresh
  ----------------------------------- */
  useEffect(() => {
    if (!open) return;

    const handleUnload = () => emitLeaveLive();

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [open]);

  /* ----------------------------------
   ♻ Reset leave flag when reopening
  ----------------------------------- */
  useEffect(() => {
    if (open) hasLeftRef.current = false;
  }, [open]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        BackdropProps={{ sx: { background: "#000000BD" } }}
        PaperProps={{
          sx: {
            p: 0,
            borderRadius: 3,
            width: "1000px",
            maxWidth: "100%",
            maxHeight: "800px",
            overflow: "hidden",
            backgroundColor: "#000",
          },
        }}
      >
        <div className="absolute top-1 right-2 z-50">
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              backdropFilter: "blur(6px)",
              width: 36,
              height: 36,
              "&:hover": {
                backgroundColor: "rgba(255,0,0,0.85)",
              },
            }}
          >
            <IoCloseCircleOutline size={22} />
          </IconButton>
        </div>

        <div className="relative h-[800px] md:flex-row  flex-col flex bg-dark rounded-lg overflow-hidden">
          {/* ================= LEFT : VIDEO (50%) ================= */}
          <div className="relative md:w-1/2   w-full bg-black">
            {/* 🎥 Live Video */}
            {selectedLive ? (
              selectedLive.is_demo ? (
                <DemoLiveVideo
                  hostPeerId={selectedLive.Live_hosts?.[0]?.peer_id}
                />
              ) : (
                <PeerVideoPlayer
                  hostPeerId={selectedLive.Live_hosts?.[0]?.peer_id}
                />
              )
            ) : (
              <p className="text-primary p-4">No live selected</p>
            )}

            {/* 🔝 Top Overlay */}
            <div
              className="absolute top-0 left-0 right-0 z-20 p-3
        flex justify-between items-center
        bg-gradient-to-b from-black/60 to-transparent"
            >
              {/* Back + User */}
              <div className="flex items-center gap-2">
                <IconButton onClick={handleClose} size="small">
                  <IoIosArrowBack className="text-primary" />
                </IconButton>
              </div>
            </div>
          </div>

          {/* ================= RIGHT : CHAT (50%) ================= */}
          <div className="  w-full  md:w-1/2 flex flex-col bg-black/90 border-l border-white/10">
            <div
              className="w-full mt-6 flex items-center justify-between  py-3
  bg-black/60 backdrop-blur-md rounded-xl border"
            >
              {/* LEFT : Profile */}
              <div className="flex items-center pl-4 gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
                  <Image
                    src={
                      liveUser?.peer_id?.[0]?.User?.profile_pic || "/user.png"
                    }
                    alt="profile"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name + Follow */}
                <div className="flex flex-col gap-1 min-w-0">
                  {/* Username */}
                  <p className="text-sm font-semibold text-white truncate max-w-[140px]">
                    {liveUser?.peer_id?.[0]?.User?.user_name || "Unknown"}
                  </p>

                  {/* Follow Button */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleFollow}
                    className={`
    inline-flex items-center mt-1 justify-center
    px-6 py-[6px] rounded-md
    text-xs font-medium
    text-white
    bg-white/10 border border-white/20
    hover:bg-white/20 active:scale-95
    transition-all duration-200
    w-fit
    ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `}
                  >
                    {loading ? "Please wait..." : "Follow"}
                  </button>
                </div>
              </div>

              {/* RIGHT : Stats */}
              <div className="flex bg-[#232323] items-center py-1   rounded-l-lg gap-3">
                {/* Likes */}
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5
       rounded-full text-xs text-white"
                >
                  <Image
                    src="/SidebarIcons/heart.png"
                    alt="heart"
                    width={12}
                    height={12}
                  />
                  <span className="font-medium">
                    {" "}
                    {activeResponse?.length
                      ? activeResponse.at(-1)?.current_like
                      : liveUser?.likes}
                  </span>
                </div>

                {/* Views */}
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5
      rounded-full text-xs text-white"
                >
                  <AiOutlineEye size={14} />
                  <span className="font-medium">
                    {" "}
                    {liveUser?.curent_viewers}
                  </span>
                </div>
              </div>
            </div>
            {/* Chat Content */}
            <div className=" absolute bottom-0 w-full  md:w-1/2  ">
              <LiveLikeComment />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
