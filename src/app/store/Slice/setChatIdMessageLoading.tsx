// store/Slice/SelectedChatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedChatState {
  chat_id: number | null;
  messageLoading: boolean;
}

const initialState: SelectedChatState = {
  chat_id: null,
  messageLoading: false,
};

const selectedChatSlice = createSlice({
  name: "selectedChat",
  initialState,
  reducers: {
    setChatId(state, action: PayloadAction<number>) {
      state.chat_id = action.payload;
    },
    clearChatId(state) {
      state.chat_id = null;
    },
    setMessageLoading(state, action: PayloadAction<boolean>) {
      state.messageLoading = action.payload;
    },
  },
});

export const { setChatId, clearChatId, setMessageLoading } =
  selectedChatSlice.actions;

export default selectedChatSlice.reducer;
