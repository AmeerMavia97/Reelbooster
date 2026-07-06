import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isMuted: boolean;
  socket_room_id: string | null;
  isApiCall: boolean;
  Peer_Id?: string;
  isDemo?: boolean;
}

const initialState: UiState = {
  isMuted: true,
  socket_room_id: null,
  isApiCall: false,
  Peer_Id: undefined,
  isDemo: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMute(state) {
      state.isMuted = !state.isMuted;
    },

    setMute(state, action: PayloadAction<boolean>) {
      state.isMuted = action.payload;
    },

    setSocketRoomId(state, action: PayloadAction<string | null>) {
      state.socket_room_id = action.payload;
    },

    // ✅ Only store Peer_Id if is_demo is true
    setPeerId(
      state,
      action: PayloadAction<{
        peerId: string;
        is_demo: boolean;
      }>
    ) {
      if (action.payload.is_demo) {
        state.Peer_Id = action.payload.peerId;
        state.isDemo = true;
      }
      // else do nothing
    },

    setIsApiCall(state, action: PayloadAction<boolean>) {
      state.isApiCall = action.payload;
    },

    resetUiState() {
      return initialState;
    },
  },
});

export const {
  toggleMute,
  setMute,
  setSocketRoomId,
  setIsApiCall,
  setPeerId,
  resetUiState,
} = uiSlice.actions;

export default uiSlice.reducer;
