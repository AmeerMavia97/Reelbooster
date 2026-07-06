import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SocialRecord } from "@/app/types/Reels";

interface UserReelsState {
  reels: SocialRecord[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
}

const initialState: UserReelsState = {
  reels: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
};

const userReelsSlice = createSlice({
  name: "userReels",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setReels(state, action: PayloadAction<SocialRecord[]>) {
      state.reels = action.payload;
    },
    appendReels(state, action: PayloadAction<SocialRecord[]>) {
      state.reels = [...state.reels, ...action.payload];
    },
    setPagination(state, action: PayloadAction<{ currentPage: number; totalPages: number }>) {
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
    },
    resetReels(state) {
      state.reels = [];
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },
});

export const { setLoading, setReels, appendReels, setPagination, resetReels } =
  userReelsSlice.actions;

export default userReelsSlice.reducer;
