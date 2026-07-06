import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatList } from "../../types/ChatListType";

// Define the initial state with an empty chatList
const initialState: ChatList[] = [];

// Create a slice of the state
const ChatListSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    // Replace full chat list
    updateChatList(state, action: PayloadAction<ChatList[]>) {
      return action.payload;
    },

    // Increment unseen count for a chat
    incrementUnseenCount(state, action: PayloadAction<{ chat_id: number; count: number }>) {
      const { chat_id, count } = action.payload;
      state.forEach((chat) => {
        chat.Records.forEach((record) => {
          if (record.chat_id === chat_id) {
            record.unseen_count = (record.unseen_count || 0) + count;
          }
        });
      });
    },

    // Reset unseen count for a chat
    resetUnseenCount(state, action: PayloadAction<{ chat_id: number }>) {
      const { chat_id } = action.payload;
      state.forEach((chat) => {
        chat.Records.forEach((record) => {
          if (record.chat_id === chat_id) {
            record.unseen_count = 0;
          }
        });
      });
    },
  },
});

// Export reducer and actions
export default ChatListSlice.reducer;
export const { updateChatList, incrementUnseenCount, resetUnseenCount } = ChatListSlice.actions;
