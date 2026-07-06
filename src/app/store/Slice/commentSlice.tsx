import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface getCommentState {
  social_id: number | null;
  currentPage: number;
  commentRefId: number;
}

const initialState: getCommentState = {
  social_id: null,
  currentPage: 1,
  commentRefId: 0,
};

const getCommentSlice = createSlice({
  name: 'getComment',
  initialState,
  reducers: {
    setSocialId(state, action: PayloadAction<number>) {
      state.social_id = action.payload;
      state.currentPage = 1;
      state.commentRefId = 0;
    },
    nextPage(state) {
      state.currentPage += 1;
    },
    resetPage(state) {
      state.currentPage = 1;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setRefId(state, action: PayloadAction<number>) {
      state.commentRefId = action.payload;
      state.currentPage = 1;
    },
    
  },
});

export const { setSocialId, nextPage, resetPage, setRefId,setCurrentPage } = getCommentSlice.actions;
export default getCommentSlice.reducer;



