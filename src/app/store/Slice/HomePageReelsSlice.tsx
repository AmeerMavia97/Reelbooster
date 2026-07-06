import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SocialRecord } from "../../types/Reels";

interface ReelsState {
  reels: SocialRecord[];
}

const initialState: ReelsState = {
  reels: [],
};

const reelsSlice = createSlice({
  name: "reels",
  initialState,
  reducers: {
    setReels: (state, action: PayloadAction<SocialRecord[]>) => {
      state.reels = action.payload;
    },
    appendReels: (state, action: PayloadAction<SocialRecord[]>) => {
      state.reels = [...state.reels, ...action.payload];
    },
    updateReel: (
      state,
      action: PayloadAction<Partial<SocialRecord> & { social_id: number }>
    ) => {
      state.reels = state.reels.map((r) =>
        r.social_id === action.payload.social_id
          ? { ...r, ...action.payload }
          : r
      );
    },
    removeReel: (state, action: PayloadAction<number>) => {
      state.reels = state.reels.filter((r) => r.social_id !== action.payload);
    },
    incrementComment: (state, action: PayloadAction<number>) => {
      state.reels = state.reels.map((r) =>
        r.social_id === action.payload
          ? {
              ...r,
              total_comments: (r.total_comments || 0) + 1, // ✅ keep as number
            }
          : r
      );
    },
    incrementShare: (state, action: PayloadAction<number>) => {
      state.reels = state.reels.map((r) =>
        r.social_id === action.payload
          ? {
              ...r,
              total_shares: (r.total_shares || 0) + 1, // ✅ keep as number
            }
          : r
      );
    },
  },
});

export const {
  setReels,
  appendReels,
  updateReel,
  removeReel,
  incrementComment,
  incrementShare,
} = reelsSlice.actions;

export default reelsSlice.reducer;
