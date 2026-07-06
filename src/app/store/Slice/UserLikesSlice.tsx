// store/Slice/userLikesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LikeListRecord, LikeListPagination } from "@/app/types/ResTypes";

interface LikesState {
  reels: LikeListRecord[];
  pagination: LikeListPagination | null;
  loading: boolean;
}

const initialState: LikesState = {
  reels: [],
  pagination: null,
  loading: false,
};

const userLikesSlice = createSlice({
  name: "userLikes",
  initialState,
  reducers: {
    setLikes(state, action: PayloadAction<LikeListRecord[]>) {
      state.reels = action.payload;
    },
    appendLikes(state, action: PayloadAction<LikeListRecord[]>) {
      state.reels = [...state.reels, ...action.payload];
    },
    setPagination(state, action: PayloadAction<LikeListPagination>) {
      state.pagination = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    resetLikes(state) {
      state.reels = [];
      state.pagination = null;
      state.loading = false;
    },
  },
});

export const {
  setLikes,
  appendLikes,
  setPagination,
  setLoading,
  resetLikes,
} = userLikesSlice.actions;

export default userLikesSlice.reducer;
