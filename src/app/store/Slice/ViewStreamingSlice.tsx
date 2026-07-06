import { ViewstreamingRes } from "@/app/types/ResTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ViewStreamingState {
  response: ViewstreamingRes | null;
}

const initialState: ViewStreamingState = {
  response: null,
};

const viewStreamingSlice = createSlice({
  name: "viewStreaming",
  initialState,
  reducers: {
    setViewStreamingResponse(state, action: PayloadAction<ViewstreamingRes>) {
      state.response = action.payload;
    },

    clearViewStreamingResponse(state) {
      state.response = null;
    },
  },
});

export const { setViewStreamingResponse, clearViewStreamingResponse } =
  viewStreamingSlice.actions;

export default viewStreamingSlice.reducer;
