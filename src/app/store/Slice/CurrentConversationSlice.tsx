import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Record, PeerUserData,Messages } from "../../types/ChatListType";


interface CurrentConversationState extends Record {
  PeerUserData?: PeerUserData;
  isNewConversation?: boolean;
  Messages: Messages[];
}

const initialState: CurrentConversationState = {
  Messages: [],
  chat_id: 0,
  chat_type: "",
  createdAt: "",
  group_icon: "",
  group_name: "",
  unseen_count: 0,
  updatedAt: "",
  PeerUserData: undefined,
  isNewConversation: false,
};

const CurrentConversationSlice = createSlice({
  name: "CurrentConversation",
  initialState,
  reducers: {
    updateCurrentConversation(
      state,
      action: PayloadAction<Partial<CurrentConversationState>>
    ) {
      return { ...state, ...action.payload };
    },
    resetCurrentConversation() {
      return initialState;
    },
    addMessageToCurrentConversation(state, action: PayloadAction<Messages>) {
      state.Messages.push(action.payload);
    },
    setMessagesForCurrentConversation(state, action: PayloadAction<Messages[]>) {
      state.Messages = action.payload;
    },
  },
});

export default CurrentConversationSlice.reducer;
export const {
  updateCurrentConversation,
  resetCurrentConversation,
  addMessageToCurrentConversation,
  setMessagesForCurrentConversation,
} = CurrentConversationSlice.actions;
