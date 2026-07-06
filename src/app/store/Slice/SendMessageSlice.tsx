import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SendMessageData } from "@/app/types/SendMessageType";

interface ExtendedSendMessageData extends SendMessageData {
  typing: boolean;
}

const initialState: ExtendedSendMessageData = {
  chat_id: 0,
  audio_time: "",
  forward_id: 0,
  latitude: 0,
  longitude: 0,
  message_content: "",
  message_type: "",
  phone_number: "",
  reply_id: 0,
  status_id: 0,
  url: "",
  thumbnail_url: "",
  video_time: "",
  showEmojiPicker: false,
  showAttachmentOptions: false,
  showGifPicker: false,
  fileName: "",
  typing: false, // 👈 added typing state
};

// Create a slice of the state
const SendMessageSlice = createSlice({
  name: "SendMessageData",
  initialState,
  reducers: {
    updateSendMessageData(
      state,
      action: PayloadAction<Partial<SendMessageData>>,
    ) {
      return { ...state, ...action.payload };
    },
    updateTypingState(
      state,
      action: PayloadAction<{ chat_id: number; typing: boolean }>
    ) {
      state.chat_id = action.payload.chat_id;
      state.typing = action.payload.typing;
    },
    resetTypingState(state) {
      state.typing = false;
    },
  },
});

// Export the reducer and actions
export default SendMessageSlice.reducer;
export const { 
  updateSendMessageData, 
  updateTypingState, 
  resetTypingState 
} = SendMessageSlice.actions;
