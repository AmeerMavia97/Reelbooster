"use client";
import { hideModal, showModal } from "@/app/store/Slice/ModalsSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import {
  clearSelectedMusic,
  setTrimmedVideo,
} from "@/app/store/Slice/MediaSlice";
import { DialogContent } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import useFFmpegVideo from "@/app/hooks/useFFmpegVideo";
import VideoTrimmer from "./VideoTrimmer";
import { toast } from "react-toastify";
import CustomDialog from "@/app/components/CustomDialog";

function TrimVideo() {
  const open = useAppSelector((state) => state.modals.TrimVideo);
  const dispatch = useAppDispatch();
  const selectedVideos = useAppSelector((state) => state.media.selectedVideos);
  const selectedMusic = useAppSelector((state) => state.media.selectedMusic);
  const videoFile = selectedVideos;
  const videoRefTop = useRef<HTMLVideoElement | null>(null);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // ✅ only from hook
  const { ready, processVideo } = useFFmpegVideo();

  // preload video + detect audio
  useEffect(() => {
    if (!videoFile) return;
    const url = URL.createObjectURL(videoFile);
    setVideoUrl(url);

    const tempVideo = document.createElement("video");
    tempVideo.src = url;
    tempVideo.onloadedmetadata = () => {
      setDuration(tempVideo.duration);
      setEnd(Math.min(30, tempVideo.duration));
      if (videoRefTop.current) {
        videoRefTop.current.currentTime = 0;
        videoRefTop.current.play().catch(() => {});
      }
    };

    const detectAudio = async () => {
      const audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          await audioCtx.decodeAudioData(e.target!.result as ArrayBuffer);
          setHasAudio(true);
        } catch {
          setHasAudio(false);
        }
      };
      reader.readAsArrayBuffer(videoFile);
    };
    detectAudio();

    return () => {
      URL.revokeObjectURL(url);
      setVideoUrl(null);
    };
  }, [videoFile]);

  useEffect(() => {
    if (videoRefTop.current && !isDragging) {
      requestAnimationFrame(() => {
        if (videoRefTop.current) {
          videoRefTop.current.currentTime = start;
          videoRefTop.current.play().catch(() => {});
        }
      });
    }
  }, [start, isDragging]);

  const handleTrim = async () => {
    if (!videoFile || !ready) return;
    if (end - start > 32) {
      toast.error("Upload max 30 seconds video only");
      return;
    }
    setLoading(true);
    try {
      const file = await processVideo({
        videoFile,
        start,
        end,
        mute: isMuted,
        musicUrl: selectedMusic?.music_url,
      });
      if (!file) return;

      const url = URL.createObjectURL(file);
      dispatch(setTrimmedVideo({ url, file }));
      dispatch(hideModal("TrimVideo"));
      dispatch(showModal("UploadReel"));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={() => dispatch(hideModal("TrimVideo"))}
      title="Trim Video"
      fullWidth
      width="500px"
    >
      <DialogContent sx={{ p: 0 }} className="overflow-hidden rounded-lg h-[500px] sm:h-auto">
      <div className="flex flex-col h-full bg-primary">
          {/* Video Preview */}
          {videoFile && videoUrl && (
            <div className="relative w-full sm:h-[650px] h-[420px] flex items-center justify-center sm:px-10 px-6 py-6 ">
              <video
                ref={videoRefTop}
                src={videoUrl}
                className="w-full h-full object-cover rounded-lg"
                autoPlay={!isDragging}
                loop
                muted={isMuted || !!selectedMusic}
              />

              <div className="flex flex-col absolute top-10 right-12 gap-3">
                {/* Mute/Unmute */}
                {hasAudio && !selectedMusic && (
                  <button
                    className="bg-dark/50 text-primary p-2 rounded-full cursor-pointer"
                    onClick={() => setIsMuted((prev) => !prev)}
                  >
                    <Image
                      src={isMuted ? "/home/muted.png" : "/home/unmuted.png"}
                      alt={isMuted ? "muted" : "unmuted"}
                      height={18}
                      width={18}
                    />
                  </button>
                )}

                {/* Add Music */}
                <button
                  className="bg-dark/50 text-primary p-2 rounded-full cursor-pointer"
                  onClick={() => dispatch(showModal("MusicList"))}
                >
                  <Image
                    src="/ReelBoost/AddMusic.png"
                    alt="addMusic"
                    width={18}
                    height={18}
                  />
                </button>
              </div>

              {/* Selected Music */}
              {selectedMusic && (
                <div className="absolute bottom-28 flex items-center gap-3 p-2 rounded-lg">
                  <div className="relative">
                    <Image
                      src={selectedMusic.music_thumbnail}
                      height={50}
                      width={50}
                      alt="music"
                      className="rounded-lg"
                    />
                    <button
                      className="absolute -top-2 -right-2 bg-dark/70 text-primary rounded-full p-1"
                      onClick={() => dispatch(clearSelectedMusic())}
                    >
                      <IoMdClose size={14} />
                    </button>
                  </div>
                  <p className="text-primary text-xs">{selectedMusic.music_title}</p>
                  <audio src={selectedMusic.music_url} autoPlay loop />
                </div>
              )}

              {/* Video Trimmer */}
              <div className="absolute bottom-2 px-4">
                <VideoTrimmer
                  duration={duration}
                  start={start}
                  end={end}
                  onStartChange={(newStart) => {
                    setStart(newStart);
                    setIsDragging(true);
                  }}
                  onEndChange={(newEnd) => {
                    setEnd(newEnd);
                    setIsDragging(true);
                  }}
                  onDragEnd={() => setIsDragging(false)}
                  videoFile={videoFile}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="px-10 pb-4">
            <button
              className="bg-main-green text-primary w-full py-3 rounded-xl text-sm font-medium"
              onClick={handleTrim}
              disabled={loading}
            >
              {loading ? "Processing..." : "Next"}
            </button>
          </div>
        </div>
      </DialogContent>
    </CustomDialog>
  );
}

export default TrimVideo;
