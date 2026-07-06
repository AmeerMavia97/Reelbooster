// components/VideoPlayer.tsx
"use client";
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  /** Video source URL (supports HLS streams) */
  src: string;

  /** Should the video start playing automatically? Default: false */
  autoPlay?: boolean;

  /** Show native video controls? Default: false */
  controls?: boolean;

  /** Should the video be muted? Default: false */
  muted?: boolean;

  /** Tailwind height class for the video container. Default: "h-[250px]" */
  height?: string;

  /** Tailwind width class for the video container. Default: "w-full" */
  width?: string;
}
/**
 * VideoPlayer component supporting HLS streams (via hls.js) and standard video sources.
 *
 * Features:
 * - Plays HLS streams on browsers that support Media Source Extensions (MSE)
 * - Falls back to native HLS playback on Safari
 * - Supports autoplay, mute, and controls
 * - Accepts custom Tailwind height class
 *
 * @param {VideoPlayerProps} props
 */

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  autoPlay = false,
  controls = false,
  muted = false,
  height = "h-[250px]", // default
  width = "w-full",
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && src) {
      let hls: Hls | null = null;

      if (Hls.isSupported()) {
        hls = new Hls({
          debug: true,
          xhrSetup: (xhr) => {
            xhr.withCredentials = false;
          },
        });

        hls.loadSource(src);
        hls.attachMedia(videoRef.current);
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = src; // Safari
      }

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay={autoPlay}
      muted={muted}
      controls={controls}
      playsInline
      className={`${width} ${height} object-fill rounded-lg`}

    />
  );
};

export default VideoPlayer;
