"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import Peer from "peerjs";

interface LiveStreamContextType {
  stream: MediaStream | null;
  setStream: (stream: MediaStream) => void;
  setPeer: (peer: Peer) => void;
  leaveStream: () => void;
}

const LiveStreamContext = createContext<LiveStreamContextType>({
  stream: null,
  setStream: () => {},
  setPeer: () => {},
  leaveStream: () => {},
});

export const LiveStreamProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stream, setStreamState] = useState<MediaStream | null>(null);
  const peerRef = useRef<Peer | null>(null);

  const setStream = (s: MediaStream) => {
    setStreamState(s);
  };

  const setPeer = (p: Peer) => {
    peerRef.current = p;
  };

  const leaveStream = () => {
    console.log("🛑 Cleaning up live stream");

    // Stop camera & mic
    stream?.getTracks().forEach((track) => track.stop());
    setStreamState(null);

    // Destroy PeerJS
    peerRef.current?.destroy();
    peerRef.current = null;
  };

  return (
    <LiveStreamContext.Provider
      value={{
        stream,
        setStream,
        setPeer,
        leaveStream,
      }}
    >
      {children}
    </LiveStreamContext.Provider>
  );
};

export const useLiveStream = () => useContext(LiveStreamContext);
