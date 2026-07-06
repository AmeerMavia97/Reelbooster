// store/Slice/reelSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reel } from '../../types/Reels';

interface ReelState {
  followingReels: Reel[];
}

const initialState: ReelState = {
  followingReels: [],
};

const reelSlice = createSlice({
  name: 'reel',
  initialState,
  reducers: {
    setReels(state, action: PayloadAction<Reel[]>) {
      state.followingReels = action.payload;
    },
    appendReels(state, action: PayloadAction<Reel[]>) {
      state.followingReels = [...state.followingReels, ...action.payload];
    },
    resetReels(state) {
      state.followingReels = [];
    },
  },
});

export const { setReels, appendReels, resetReels } = reelSlice.actions;
export default reelSlice.reducer;
