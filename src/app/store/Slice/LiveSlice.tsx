// store/Slice/LiveSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  JoinLive,
  LiveRecord,
  ActivityOnLiveComment,
  ActivityOnLiveLike,
} from "@/app/types/LiveReels";

interface LiveState {
  lives: LiveRecord[];
  selectedLive?: LiveRecord;
  socket_room_id?: string;
  user_id?: number;
  liveEvents: (ActivityOnLiveComment | ActivityOnLiveLike)[];
  commentDraft: string;
  joinLiveResponse?: JoinLive; // 👈 store full JoinLive response
}

const initialState: LiveState = {
  lives: [],
  selectedLive: undefined,
  socket_room_id: undefined,
  user_id: 0,
  liveEvents: [],
  commentDraft: "",
  joinLiveResponse: undefined, // 👈 initially empty
};

const liveSlice = createSlice({
  name: "live",
  initialState,
  reducers: {
    setLives: (state, action: PayloadAction<LiveRecord[]>) => {
      state.lives = action.payload;
    },
    setSelectedLive: (state, action: PayloadAction<LiveRecord | undefined>) => {
      state.selectedLive = action.payload;
    },
    clearSelectedLive: (state) => {
      state.selectedLive = undefined;
    },
    setLiveData: (
      state,
      action: PayloadAction<{ socket_room_id: string; user_id: number }>
    ) => {
      state.socket_room_id = action.payload.socket_room_id;
      state.user_id = action.payload.user_id;
    },
    clearLiveMeta: (state) => {
      state.socket_room_id = undefined;
      state.user_id = undefined;
    },

    // Events
    addLiveEvent: (
      state,
      action: PayloadAction<ActivityOnLiveComment | ActivityOnLiveLike>
    ) => {
      state.liveEvents.push(action.payload);
    },
    clearLiveEvents: (state) => {
      state.liveEvents = [];
    },

    // Join Live Response
    setJoinLiveResponse: (state, action: PayloadAction<JoinLive>) => {
      state.joinLiveResponse = action.payload;
    },

    // Comment draft
    setCommentDraft: (state, action: PayloadAction<string>) => {
      state.commentDraft = action.payload;
    },
    clearCommentDraft: (state) => {
      state.commentDraft = "";
    },
  },
});

export const {
  setLives,
  setSelectedLive,
  clearSelectedLive,
  setLiveData,
  clearLiveMeta,
  addLiveEvent,
  clearLiveEvents,
  setJoinLiveResponse, // 👈 export new reducer
  setCommentDraft,
  clearCommentDraft,
} = liveSlice.actions;

export default liveSlice.reducer;
