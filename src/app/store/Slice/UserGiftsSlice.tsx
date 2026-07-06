
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecievedGiftPagination,RecievedGiftRecord } from "@/app/types/Gift";

interface GiftsState {
  reels: RecievedGiftRecord[];
  pagination: RecievedGiftPagination | null;
  loading: boolean;
}

const initialState: GiftsState = {
  reels: [],
  pagination: null,
  loading: false,
};

const userGiftsSlice = createSlice({
  name: "userGifts",
  initialState,
  reducers: {
    setGifts(state, action: PayloadAction<RecievedGiftRecord[]>) {
      state.reels = action.payload;
    },
    appendGifts(state, action: PayloadAction<RecievedGiftRecord[]>) {
      state.reels = [...state.reels, ...action.payload];
    },
    setPagination(state, action: PayloadAction<RecievedGiftPagination>) {
      state.pagination = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    resetGifts(state) {
      state.reels = [];
      state.pagination = null;
      state.loading = false;
    },
  },
});

export const {
  setGifts,
  appendGifts,
  setPagination,
  setLoading,
  resetGifts,
} = userGiftsSlice.actions;

export default userGiftsSlice.reducer;
