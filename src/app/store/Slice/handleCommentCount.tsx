// store/Slice/commentAddedSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommentState {
  commentAdded: boolean;
  ReelSharedId: number | null; // stores social_id of the shared reel
}

const initialState: CommentState = {
  commentAdded: false,
  ReelSharedId: null,
};

const commentAddedSlice = createSlice({
  name: "commentAdded",
  initialState,
  reducers: {
    setCommentAddedTrue(state) {
      state.commentAdded = true;
    },
    setCommentAddedFalse(state) {
      state.commentAdded = false;
    },
    setReelSharedTrue(state, action: PayloadAction<number>) {
      state.ReelSharedId = action.payload; // pass the social_id
    },
    setReelSharedFalse(state) {
      state.ReelSharedId = null;
    },
  },
});

export const {
  setCommentAddedTrue,
  setCommentAddedFalse,
  setReelSharedTrue,
  setReelSharedFalse,
} = commentAddedSlice.actions;

export default commentAddedSlice.reducer;
