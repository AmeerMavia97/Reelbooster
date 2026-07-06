// store/slices/commentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommentState {
  activeCommentPostId: number | null;
  activeReelId: number | null;
  activeReelUserId: number | null;
}

const initialState: CommentState = {
  activeCommentPostId: null,
  activeReelId:null,
  activeReelUserId:null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setActiveCommentPostId: (state, action: PayloadAction<number | null>) => {
      state.activeCommentPostId = action.payload;
    },
    setActiveUserId: (state, action: PayloadAction<number | null>) => {
      state.activeReelUserId = action.payload;
    },
    setActiveReelId:(state,action) => {
      state.activeReelId = action.payload.activeReelId;
      state.activeReelUserId = action.payload.activeReelUserId;
    },
  },
});

export const { setActiveCommentPostId,setActiveReelId,setActiveUserId } = commentSlice.actions;
export default commentSlice.reducer;
