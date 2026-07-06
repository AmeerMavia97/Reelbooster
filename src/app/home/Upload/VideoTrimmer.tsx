"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface VideoTrimmerProps {
  duration: number;
  start: number;
  end: number;
  onStartChange: (start: number) => void;
  onEndChange: (end: number) => void;
  onDragEnd: () => void;
  videoFile: File | null;
}

const VideoTrimmer: React.FC<VideoTrimmerProps> = ({
  duration,
  start,
  end,
  onStartChange,
  onEndChange,
  onDragEnd,
  videoFile,
}) => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  // Generate thumbnails and validate duration
  useEffect(() => {
    if (!videoFile || duration <= 0) return;

    let url: string | null = null;
    const generateThumbnails = async () => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      url = URL.createObjectURL(videoFile);
      video.src = url;
      video.muted = true;

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => resolve();
      });

      const thumbnailCount = Math.min(5, Math.ceil(duration)); // Reduced for performance
      const interval = duration / thumbnailCount;
      const newThumbnails: string[] = [];

      for (let i = 0; i < thumbnailCount; i++) {
        const time = i * interval;
        try {
          await new Promise<void>((resolve, reject) => {
            video.currentTime = time;
            video.onseeked = () => {
              canvas.width = 100;
              canvas.height = 56;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumbnail = canvas.toDataURL("image/jpeg");
              newThumbnails.push(thumbnail);
              resolve();
            };
            video.onerror = () => reject(new Error("Seek failed"));
          });
        } catch {}
      }

      setThumbnails(newThumbnails);
    };

    generateThumbnails();

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [videoFile, duration]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Dragging logic with throttling and touch support
  const handleDrag = (e: React.MouseEvent | React.TouchEvent, type: "start" | "end") => {
    const container = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
    if (!container) return;

    let lastUpdateTime = 0;
    const throttleDelay = 50;

    const move = (ev: MouseEvent | TouchEvent) => {
      const now = performance.now();
      if (now - lastUpdateTime < throttleDelay) return;
      lastUpdateTime = now;

      const clientX = "touches" in ev ? ev.touches[0].clientX : (ev as MouseEvent).clientX;
      const percent = (clientX - container.left) / container.width;
      const newTime = Math.min(Math.max(percent * duration, 0), duration);

      if (type === "start") {
        onStartChange(Math.min(newTime, end - 1));
      } else {
        onEndChange(Math.max(newTime, start + 1));
      }
    };

    const stop = () => {
      window.removeEventListener("mousemove", move as EventListener);
      window.removeEventListener("touchmove", move as EventListener);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
      onDragEnd();
    };

    window.addEventListener("mousemove", move as EventListener);
    window.addEventListener("touchmove", move as EventListener, { passive: false });
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
  };

  return (
    <div className="relative w-full px-10 pb-4">
      {/* Thumbnail Track */}
      <div className="relative h-14 bg-dark/60 rounded-lg gap-1 border border-main-green overflow-hidden flex mt-4">
        {thumbnails.length > 0 ? (
          thumbnails.map((thumb, index) => (
            <Image
              key={index}
              src={thumb}
              alt={`thumbnail-${index}`}
              width={42}
              height={56}
              className="h-full flex-1 object-cover"
            />
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 w-full text-xs">
            Loading thumbnails
          </div>
        )}

        {/* Overlay for non-selected range before start */}
        <div
          className="absolute h-full bg-dark/50"
          style={{
            left: "0%",
            width: `${(start / duration) * 100}%`,
          }}
        />

        {/* Overlay for non-selected range after end */}
        <div
          className="absolute h-full bg-dark/50"
          style={{
            left: `${(end / duration) * 100}%`,
            width: `${100 - (end / duration) * 100}%`,
          }}
        />

        {/* Selected Range */}
        <div
          className="absolute h-full border-3 border-main-green rounded-lg"
          style={{
            left: `${(start / duration) * 100}%`,
            width: `${((end - start) / duration) * 100}%`,
          }}
        >
          {/* Drag Handles on Selected Range Ends */}
          <div
            className="absolute w-3 h-3 bg-primary rounded-full cursor-ew-resize border border-main-green"
            style={{
              left: "0%",
              transform: "translateX(-50%)",
              top: "50%",
              marginTop: "-6px",
              zIndex: 10,
            }}
            onMouseDown={(e) => handleDrag(e, "start")}
            onTouchStart={(e) => handleDrag(e, "start")}
          />
          <div
            className="absolute w-3 h-3 bg-primary rounded-full cursor-ew-resize border border-main-green"
            style={{
              right: "0%",
              transform: "translateX(50%)",
              top: "50%",
              marginTop: "-6px",
              zIndex: 10,
            }}
            onMouseDown={(e) => handleDrag(e, "end")}
            onTouchStart={(e) => handleDrag(e, "end")}
          />
        </div>
      </div>

      <div className="flex justify-between mt-1 text-primary text-xs">
        <span>{formatTime(start)}</span>
        <span>{formatTime(end)}</span>
      </div>
    </div>
  );
};

export default VideoTrimmer;