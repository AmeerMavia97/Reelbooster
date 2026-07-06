import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FollowerRecord } from "../../types/FollowFollowingList";

interface FollowersState {
  followers: FollowerRecord[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  isFetchingMore: boolean;
}

const initialState: FollowersState = {
  followers: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  isFetchingMore: false,
};

const followersSlice = createSlice({
  name: "followers",
  initialState,
  reducers: {
    setFollowers: (state, action: PayloadAction<FollowerRecord[]>) => {
      state.followers = action.payload;
    },
    appendFollowers: (state, action: PayloadAction<FollowerRecord[]>) => {
      state.followers = [...state.followers, ...action.payload];
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsFetchingMore: (state, action: PayloadAction<boolean>) => {
      state.isFetchingMore = action.payload;
    },
    updateFollowStatus: (
      state,
      action: PayloadAction<{ userId: number; isFollowed: boolean }>
    ) => {
      state.followers = state.followers.map((f) =>
        f.follower.user_id === action.payload.userId
          ? { ...f, isFollowed: action.payload.isFollowed }
          : f
      );
    },
    resetFollowers: (state) => {
      state.followers = [];
      state.page = 1;
      state.hasMore = true;
      state.isLoading = false;
      state.isFetchingMore = false;
    },
  },
});

export const {
  setFollowers,
  appendFollowers,
  setPage,
  setHasMore,
  setIsLoading,
  setIsFetchingMore,
  updateFollowStatus,
  resetFollowers,
} = followersSlice.actions;

export default followersSlice.reducer;