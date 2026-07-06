// store/Slice/FollowCountSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FollowState {
  followersCount: number;
  followingCount: number;
}

const initialState: FollowState = {
  followersCount: 0,
  followingCount: 0,
};

const followFollowingSlice = createSlice({
  name: "followFollowingCount",
  initialState,
  reducers: {
    setFollowersCount: (state, action: PayloadAction<number>) => {
      state.followersCount = action.payload;
    },
    incrementFollowers: (state) => {
      state.followersCount += 1;
    },
    decrementFollowers: (state) => {
      state.followersCount -= 1;
    },
    setFollowingCount: (state, action: PayloadAction<number>) => {
      state.followingCount = action.payload;
    },
    // store/Slice/FollowFollowingCount.ts
    incrementFollowing: (state) => {
      state.followingCount += 1;
    },
    decrementFollowing: (state) => {
      state.followingCount -= 1;
    },
  },
});

export const {
  setFollowersCount,
  setFollowingCount,
  incrementFollowers,
  decrementFollowers,
  incrementFollowing,
  decrementFollowing
} = followFollowingSlice.actions;

export default followFollowingSlice.reducer;
