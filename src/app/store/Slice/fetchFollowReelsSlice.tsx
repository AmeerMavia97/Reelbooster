// store/Slice/FollowSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FollowState {
  refreshReels: boolean;
}

const initialState: FollowState = {
  refreshReels: false,
};

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    triggerReelsRefresh(state) {
      state.refreshReels = true;
    },
    resetReelsRefresh(state) {
      state.refreshReels = false;
    },
  },
});

export const { triggerReelsRefresh, resetReelsRefresh } = followSlice.actions;
export default followSlice.reducer;
