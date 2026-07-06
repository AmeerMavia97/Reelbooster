import { Reel } from "@/app/types/Reels";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MusicState {
  musicId: number | null;
  musicName: string | null;
  musicImage: string | null;
  total_socials: number;
  reels:Reel[],
  currentPage: number;
  totalPages: number;
}

const initialState: MusicState = {
  musicId: 0,
  musicName: null,
  musicImage: null,
  total_socials: 0,
  reels:[],
  currentPage: 1,
  totalPages: 1,
};

const ViewAudioSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    setMusicData: (
      state,
      action: PayloadAction<{
        musicId: number;
        musicName: string;
        musicImage: string;
        total_socials: number;
      }>
    ) => {
      state.musicId = action.payload.musicId;
      state.musicName = action.payload.musicName;
      state.musicImage = action.payload.musicImage;
      state.total_socials = action.payload.total_socials;
    },
    updateSocials: (state, action: PayloadAction<number>) => {
      state.total_socials = action.payload;
    },
    clearMusicData: (state) => {
    state.musicId = null;
      state.musicName = null;
      state.musicImage = null;
      state.total_socials = 0;
    },
    setMusicDetails: (state, action: PayloadAction<Partial<MusicState>>) => {
      return { ...state, ...action.payload };
    },
    setTotalSocials: (state, action: PayloadAction<number>) => {
      state.total_socials = action.payload;
    },
    setReels: (state, action: PayloadAction<Reel[]>) => {
      state.reels = action.payload;
    },
    appendReels: (state, action: PayloadAction<Reel[]>) => {
      state.reels = [...state.reels, ...action.payload];
    },
    setPagination: (
      state,
      action: PayloadAction<{ currentPage: number; totalPages: number }>
    ) => {
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
    },
  },
});

export const { setMusicData, updateSocials, clearMusicData,setTotalSocials,setReels,appendReels,setPagination } = ViewAudioSlice.actions;
export default ViewAudioSlice.reducer;



