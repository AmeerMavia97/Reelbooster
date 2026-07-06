// store/slices/mediaSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MusicRecord } from "../../types/ResTypes";

interface MediaState {
  selectedMusic: MusicRecord | null;
  musicList: MusicRecord[];
  selectedVideos: File | null; // store uploaded video files
  selectedVideoUrl: string | null;
  trimmedVideoUrl: string | null; // for preview
  trimmedVideoFile: File | null; // for upload
  caption: string;
  music_id: string | null;
  location: string;
  startTime: number;
  endTime: number;
  isMuted: boolean;
}

const initialState: MediaState = {
  selectedMusic: null,
  musicList: [],
  selectedVideos: null,
  selectedVideoUrl: null,
  trimmedVideoFile: null,
  trimmedVideoUrl: null,
  caption: "",
  music_id: null,
  location: "",
  startTime: 0,
  endTime: 0,
  isMuted: false,
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    // MUSIC -------------------------
    setMusicList: (state, action: PayloadAction<MusicRecord[]>) => {
      state.musicList = action.payload;
    },
    setSelectedMusic: (state, action: PayloadAction<MusicRecord>) => {
      state.selectedMusic = action.payload;
    },
    clearSelectedMusic: (state) => {
      state.selectedMusic = null;
    },
    setStartTime: (state, action: PayloadAction<number>) => {
      state.startTime = action.payload;
    },
    setEndTime: (state, action: PayloadAction<number>) => {
      state.endTime = action.payload;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },

    // VIDEO -------------------------
    // addVideos: (state, action: PayloadAction<File[]>) => {
    //   state.selectedVideos.push(...action.payload);
    // },
    // removeVideo: (state, action: PayloadAction<number>) => {
    //   state.selectedVideos = state.selectedVideos.filter(
    //     (_, i) => i !== action.payload
    //   );
    // },
    // clearVideos: (state) => {
    //   state.selectedVideos = [];
    // },
    setSelectedVideo: (state, action: PayloadAction<File>) => {
      state.selectedVideos = action.payload; // ✅ replace any previous video
    },
    setVideoUrl: (state, action: PayloadAction<string | null>) => {
      state.selectedVideoUrl = action.payload;
    },
    clearVideo: (state) => {
      state.selectedVideos = null;
      state.selectedVideoUrl = null;
      state.trimmedVideoUrl = null;
      state.trimmedVideoFile = null;
      state.startTime = 0;
      state.endTime = 0;
    },

    setTrimmedVideo: (
      state,
      action: PayloadAction<{ url: string; file: File } | null>
    ) => {
      if (action.payload) {
        state.trimmedVideoUrl = action.payload.url;
        state.trimmedVideoFile = action.payload.file;
      } else {
        state.trimmedVideoUrl = null;
        state.trimmedVideoFile = null;
      }
    },

    setCaption: (state, action: PayloadAction<string>) => {
      state.caption = action.payload;
    },
    setMusicId: (state, action: PayloadAction<string>) => {
      state.music_id = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
  },
});

export const {
  setMusicList,
  setSelectedMusic,
  clearSelectedMusic,
  setSelectedVideo,
  setVideoUrl,
  clearVideo,
  setTrimmedVideo,
  setCaption,
  setMusicId,
  setLocation,
  setStartTime,
  setEndTime,
  setMuted,
} = mediaSlice.actions;

export default mediaSlice.reducer;
