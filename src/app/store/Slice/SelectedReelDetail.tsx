// store/Slice/selectedReelSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reel } from "../../types/Reels";

interface SelectedReelState {
  reel: Reel | null;
  ReelId:number
}

const initialState: SelectedReelState = {
  reel: null,
  ReelId:0
};

const selectedReelSlice = createSlice({
  name: "selectedReel",
  initialState,
  reducers: {
    setSelectedReel(state, action: PayloadAction<Reel>) {
      state.reel = action.payload;
    },
    setSelectedReelId(state, action: PayloadAction<number>) {
      state.ReelId = action.payload;
    },
    clearSelectedReel(state) {
      state.reel = null;
      state.ReelId = 0
    },
    incrementShareCount: (state) => {
      if(state.reel) {
        state.reel.total_shares = Number(state.reel.total_shares || 0) + 1;
      }
    },
    updateLikeStatus: (state) => {
      if (state.reel) {
        state.reel.isLiked = !state.reel.isLiked;
        state.reel.total_likes =
          Number(state.reel.total_likes) + (state.reel.isLiked ? 1 : -1);
      }
    },
    updateBookmarkStatus: (state) => {
      if (state.reel) {
        state.reel.isSaved = !state.reel.isSaved;
        state.reel.total_saves =
          Number(state.reel.total_saves) + (state.reel.isSaved ? 1 : -1);
      }
    },
    updateFollowStatus: (state) => {
      if (state.reel) {
        state.reel.isFollowing = !state.reel.isFollowing;
      }
    },
    // store/Slice/SelectedReelDetail.ts
    incrementCommentCount: (state) => {
      if (state.reel) {
        state.reel.total_comments = Number(state.reel.total_comments || 0) + 1;
      }
    },
  },
});

export const {
  setSelectedReel,
  setSelectedReelId,
  clearSelectedReel,
  updateLikeStatus,
  updateBookmarkStatus,
  updateFollowStatus,
  incrementShareCount,
  incrementCommentCount,
} = selectedReelSlice.actions;
export default selectedReelSlice.reducer;
