import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FollowingRecord } from "../../types/FollowFollowingList";

interface FollowingState {
  following: FollowingRecord[];
  page: number;
  totalPages: number;
  hasMore: boolean;
  isLoading: boolean;
  isFetchingMore: boolean;
}

const initialState: FollowingState = {
  following: [],
  page: 1,
  totalPages: 1,
  hasMore: true,
  isLoading: false,
  isFetchingMore: false,
};

const followingSlice = createSlice({
  name: "following",
  initialState,
  reducers: {
    setFollowing: (state, action: PayloadAction<FollowingRecord[]>) => {
      state.following = action.payload;
    },
    appendFollowing: (state, action: PayloadAction<FollowingRecord[]>) => {
      state.following = [...state.following, ...action.payload];
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
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
      state.following = state.following.map((f) =>
        f.User.user_id === action.payload.userId
          ? { ...f, isFollowed: action.payload.isFollowed }
          : f
      );
    },
    resetFollowing: (state) => {
      state.following = [];
      state.page = 1;
      state.totalPages = 1;
      state.hasMore = true;
      state.isLoading = false;
      state.isFetchingMore = false;
    },
  },
});

export const {
  setFollowing,
  appendFollowing,
  setPage,
  setTotalPages,
  setHasMore,
  setIsLoading,
  setIsFetchingMore,
  updateFollowStatus,
  resetFollowing,
} = followingSlice.actions;

export default followingSlice.reducer;