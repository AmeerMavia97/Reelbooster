//@ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import type { FFmpeg } from "@ffmpeg/ffmpeg";

export default function useFFmpegVideo() {
  const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // ✅ Prevents running on server

    (async () => {
      try {
        const { FFmpeg } = await import("@ffmpeg/ffmpeg"); // ✅ Dynamic import
        const ffmpegInstance = new FFmpeg();
        await ffmpegInstance.load();
        setFfmpeg(ffmpegInstance);
        setReady(true);
      } catch (err) {
      }
    })();
  }, []);

  const processVideo = async ({ 
    videoFile,
    start,
    end,
    mute,
    musicUrl,
  }: {
    videoFile: File;
    start?: number;
    end?: number;
    mute?: boolean;
    musicUrl?: string;
  }): Promise<File | null> => {
    if (!ready || !ffmpeg || !videoFile) return null;

    await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

    let args: string[];

    if (musicUrl) {
      const musicData = await fetch(musicUrl).then((res) => res.arrayBuffer());
      await ffmpeg.writeFile("music.mp3", new Uint8Array(musicData));

      args = [
        ...(start !== undefined ? ["-ss", start.toString()] : []),
        ...(end !== undefined ? ["-to", end.toString()] : []),
        "-i", "input.mp4",
        "-i", "music.mp3",
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "28",
        "-c:a", "aac",
        "-shortest",
        "output.mp4",
      ];
    } else if (mute) {
      args = [
        ...(start !== undefined ? ["-ss", start.toString()] : []),
        ...(end !== undefined ? ["-to", end.toString()] : []),
        "-i", "input.mp4",
        "-c:v", "copy",
        "-an",
        "output.mp4",
      ];
    } else {
      args = [
        ...(start !== undefined ? ["-ss", start.toString()] : []),
        ...(end !== undefined ? ["-to", end.toString()] : []),
        "-i", "input.mp4",
        "-c:v", "copy",
        "-c:a", "copy",
        "output.mp4",
      ];
    }


    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile("output.mp4");
    const blob = new Blob([data], { type: "video/mp4" });
    return new File([blob], "processed_output.mp4", { type: "video/mp4" });
  };

  return { ready, processVideo };
}
