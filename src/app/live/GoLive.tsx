// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import Peer from "peerjs";
// import GoToliveModal from "./GoToliveModal";
// import LiveCountdownModal from "./LiveCountdown";
// import { socketInstance } from "../socket/socket";
// import { useAppSelector } from "../utils/hooks";
// import { useRouter } from "next/navigation";
// import StreamMain from "../components/Hoster/Stream/StreamMain";

// export default function GoLive() {
//   const peerRef = useRef<Peer | null>(null);
//   const localStreamRef = useRef<MediaStream | null>(null);

//   const router = useRouter()

//   const [isLive, setIsLive] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [openModal, setOpenModal] = useState(false);
//   const [showCountdown, setShowCountdown] = useState(false);

//   const socket = socketInstance();

//   const socket_room_id = useAppSelector(
//     (state) => state.live.lives[0]?.socket_room_id
//   );

//   // 🎥 CAMERA PERMISSION (HOST ONLY)
//   const getPermissions = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       localStreamRef.current = stream;
//       return stream;
//     } catch {
//       setError("Camera or microphone permission denied");
//       return null;
//     }
//   }, []);

//   // 🚀 START LIVE
//   const startLive = useCallback(async () => {
//     if (isLive) return;

//     setIsLoading(true);
//     setError("");

//     const stream = localStreamRef.current || (await getPermissions());
//     if (!stream) {
//       setIsLoading(false);
//       return;
//     }

//     const peer = new Peer({
//       host: "peer.whoxachat.com",
//       port: 443,
//       secure: true,
//       path: "/",
//     });

//     peer.on("open", (peerId) => {
//       console.log("Host Peer ID:", peerId);
//       socket.emit("start_live", { peer_id: peerId });
//       setIsLive(true);
//       setIsLoading(false);
//       setOpenModal(true);
//     });

//     // ✅ SEND STREAM TO VIEWERS
//     peer.on("call", (call) => {
//       const stream = localStreamRef.current;
//       if (!stream) return;

//       console.log("Answering call with tracks:", stream.getTracks());

//       call.answer(stream);

//       call.on("close", () => {
//         console.log("Viewer disconnected");
//       });
//     });



//     peerRef.current = peer;
//   }, [getPermissions, isLive, socket]);

//   const handleGoLiveClick = async () => {
//     if (isLive || isLoading) return;
//     const stream = await getPermissions();
//     if (stream) {
//     setShowCountdown(true);
//   }
//   };

//   const handleLeaveLive = () => {
//     setIsLive(false);
//     setOpenModal(false);

//     socket.emit("stop_live", { socket_room_id });

//     localStreamRef.current?.getTracks().forEach((t) => t.stop());
//     localStreamRef.current = null;

//     peerRef.current?.destroy();
//     peerRef.current = null;
//   };

//   // 🧹 CLEANUP ON TAB CLOSE
//   useEffect(() => {
//     const handleUnload = () => {
//       socket.emit("stop_live", { socket_room_id });
//     };
//     window.addEventListener("beforeunload", handleUnload);
//     return () => window.removeEventListener("beforeunload", handleUnload);
//   }, [socket_room_id]);




//   return (
//     <>
//       <div className="w-full flex mt-6 justify-between items-center">
//         <h2 className="px-4 text-xl text-dark font-semibold">
//           Live
//         </h2>
//         <button
//           onClick={handleGoLiveClick}
//           disabled={isLive || isLoading}
//           className="cursor-pointer px-10  mr-5 py-3 rounded-xl bg-main-green text-white font-semibold"
//         >
//           {isLive ? "LIVE" : "Go Live"}
//         </button>


//       </div>

//       <LiveCountdownModal
//         open={showCountdown}
//         seconds={5}
//         onComplete={() => {
//           setShowCountdown(false);
//           startLive();
//         }}
//       />

//       <GoToliveModal
//         open={openModal}
//         stream={localStreamRef.current}
//         onLeave={handleLeaveLive}
//       />

//         {/* <StreamMain
//         open={openModal}
//         stream={localStreamRef.current}
//         onLeave={handleLeaveLive}
//       /> */}
//     </>
//   );
// }


"use client";

import React, { useState } from "react";
import Peer from "peerjs";
import { useRouter } from "next/navigation";
import { socketInstance } from "../socket/socket";
import { useAppSelector } from "../utils/hooks";
import { useLiveStream } from "../context/LiveStreamContext";

export default function GoLive() {
  const router = useRouter();
  const socket = socketInstance();

  const { stream, setStream, setPeer } = useLiveStream();

  const socketRoomId = useAppSelector(
    (state) => state.live.lives?.[0]?.socket_room_id
  );

  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startLive = async () => {
    if (isLive || isLoading) return;

    setIsLoading(true);

    try {
      const mediaStream =
        stream ||
        (await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        }));

      setStream(mediaStream);

      const peer = new Peer({
        host: "peer.whoxachat.com",
        port: 443,
        secure: true,
        path: "/",
      });

      peer.on("open", (peerId) => {
        console.log("🟢 Host Peer ID:", peerId);

        socket.emit("start_live", {
          peer_id: peerId,
        });

        setPeer(peer);
        setIsLive(true);
        setIsLoading(false);

        router.push("/host");
      });

      peer.on("call", (call) => {
        call.answer(mediaStream);
      });

      peer.on("error", (err) => {
        console.error("Peer error:", err);
        setIsLoading(false);
      });
    } catch (err) {
      console.error("Permission denied:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black">Live</h2>

        <button
          onClick={startLive}
          disabled={isLoading}
          className="px-8 py-3 rounded-xl bg-main-green cursor-pointer text-white font-semibold"
        >
          {isLoading ? "Starting..." : "Go Live"}
        </button>
      </div>
    </div>
  );
}
