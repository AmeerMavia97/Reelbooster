const generateVideoThumbnail = (
  videoFile: File,
  videoTimeInSeconds: number = 1,
  retries: number = 3
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!videoFile.type.includes("video")) {
      return reject("File is not a valid video");
    }

    const url = URL.createObjectURL(videoFile);
    const video = document.createElement("video");
    let retryCount = 0;

    video.preload = "metadata";
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous"; // Optional: Helps with CORS issues
    video.load();

    const capture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Could not get canvas context");

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL("image/png");

      // If blank image, retry
      if ((thumbnail.length < 100000 || thumbnail.includes("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB")) && retryCount < retries) {
        retryCount++;
        video.currentTime = videoTimeInSeconds + retryCount; // Try next second
      } else {
        URL.revokeObjectURL(url);
        resolve(thumbnail);
      }
    };

    video.addEventListener("loadeddata", () => {
      try {
        // If video duration is too short, fallback to first frame
        video.currentTime = Math.min(video.duration - 0.1, videoTimeInSeconds);
      } catch (e) {
        video.currentTime = 0;
      }
    });

    video.addEventListener("seeked", capture);
    video.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject("Error loading video: " + err);
    };
  });
};

export default generateVideoThumbnail;
