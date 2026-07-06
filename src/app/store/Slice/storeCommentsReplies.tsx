// commentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Record } from "@/app/types/CommentRes";

interface CommentState {
  refId: number | null;
  replies: Record[];
  mainComments: Record[];
  replyingTo?: {
    commentId: number;
    userName: string;
  } | null;
}

const initialState: CommentState = {
  refId: null,
  replies: [],
  mainComments: [],
  replyingTo: null,
};

const commentReplySlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setRefId: (state, action: PayloadAction<number>) => {
      state.refId = action.payload;
    },
    setReplies: (state, action: PayloadAction<Record[]>) => {
      state.replies = action.payload;
    },
    addReply: (state, action: PayloadAction<Record>) => {
      state.replies.push(action.payload);
    },
    setMainCommentRefId: (state, action: PayloadAction<number>) => {
      state.refId = action.payload;
    },
    setMainComments: (state, action: PayloadAction<Record[]>) => {
      state.mainComments = action.payload;
    },
    addMainComments: (state, action: PayloadAction<Record>) => {
      state.mainComments = [...state.mainComments, action.payload];
    },

    setReplyingTo: (
      state,
      action: PayloadAction<{ commentId: number; userName: string }>
    ) => {
      state.replyingTo = action.payload;
    },
    clearReplyingTo: (state) => {
      state.replyingTo = null;
    },
  },
});

export const {
  setRefId,
  setReplies,
  addReply,
  setMainCommentRefId,
  setMainComments,
  addMainComments,
  setReplyingTo,
  clearReplyingTo,
} = commentReplySlice.actions;
export default commentReplySlice.reducer;
