import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserIdState {
  user_id: number | null;
  hashtag_name: string | null;
  count:string | null;
  hashtag_version:0
}

const initialState: UserIdState = {
  user_id: null,
  hashtag_name: null,
  count:null,
  hashtag_version:0
};

const userIdSlice = createSlice({
  name: "userId",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<number>) => {
      state.user_id = action.payload;
    },
    clearUserId: (state) => {
      state.user_id = null;
    },
    setHashtag: (
      state,
      action: PayloadAction<{ hashtag_name: string; count?: string }>
    ) => {
      state.hashtag_name = action.payload.hashtag_name;
      state.count = action.payload.count ?? null; // default to null if not provided
    },
    clearHashtagId: (state) => {
      state.hashtag_name = null;
      state.count = null;
    },
  },
});

export const { setUserId, clearUserId, setHashtag, clearHashtagId } = userIdSlice.actions;
export default userIdSlice.reducer;
