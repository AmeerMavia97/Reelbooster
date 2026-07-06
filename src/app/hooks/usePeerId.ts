"use client";
import { useEffect, useState } from "react";
import Peer from "peerjs";
import Cookies from "js-cookie";

export default function usePeerId() {
  const [peerId, setPeerId] = useState<string | null>(null);

  useEffect(() => {
    // Check if we already have a peer_id in cookies
    const existingPeerId = Cookies.get("peer_id");

    if (existingPeerId) {
      setPeerId(existingPeerId);
      return;
    }

    // Generate a new peer_id
    const peer = new Peer();

    peer.on("open", (id) => {

      // Save in state + cookie
      setPeerId(id);
      Cookies.set("peer_id", id, {
          secure: true,
          sameSite: "Strict",
          expires: 30,
        });
    });

    peer.on("error", (err) => {
    });

    // Cleanup on unmount
    return () => {
      peer.destroy();
    };
  }, []);

  return peerId;
}
