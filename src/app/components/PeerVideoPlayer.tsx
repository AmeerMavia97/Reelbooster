"use client";

import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { socketInstance } from "../socket/socket";
import { useAppSelector } from "../utils/hooks";

interface Props {
  hostPeerId: string;
}

export default function PeerVideoPlayer({ hostPeerId }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const hasJoinedRef = useRef(false);

  const [connected, setConnected] = useState(false);

  const socket_room_id = useAppSelector(
    (state) => state.live.selectedLive?.socket_room_id
  );

  const user_id = useAppSelector(
    (state) => state.live.selectedLive?.Live_hosts[0].User.user_id
  );

  const socket = socketInstance();

  useEffect(() => {
    if (!hostPeerId || !socket_room_id || !user_id) return;
    if (peerRef.current) return;

    const peer = new Peer({
      host: "peer.whoxachat.com",
      port: 443,
      secure: true,
      path: "/",
    });

    peerRef.current = peer;

    peer.on("open", (viewerPeerId) => {
      console.log("Viewer Peer ID:", viewerPeerId);

      if (!hasJoinedRef.current) {
        socket.emit("join_live", {
          socket_room_id,
          user_id,
          peer_id: viewerPeerId,
        });
        hasJoinedRef.current = true;
      }

      // ✅ DUMMY VIDEO TRACK (NO CAMERA)
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;

      const stream = canvas.captureStream();
      const call = peer.call(hostPeerId, stream);

      if (!call) return;

      call.on("stream", (remoteStream) => {
        console.log("Viewer received stream");

        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
          videoRef.current.play().catch(console.error);
        }

        setConnected(true);
      });

      call.on("error", console.error);
    });

    peer.on("error", console.error);

    return () => {
      peer.destroy();
      peerRef.current = null;
      hasJoinedRef.current = false;
    };
  }, [hostPeerId, socket_room_id, user_id]);

  return (
    <div className="relative w-full h-full bg-black rounded-md overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {!connected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
          Connecting to live stream...
        </div>
      )}
    </div>
  );
}
