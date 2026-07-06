import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageRecord } from "@/app/types/MessageListType";
// Define the initial state with an empty MessageList
const initialState: MessageRecord[] = [];

// Create a slice of the state
const MessageListSlice = createSlice({
  name: "MessageList",
  initialState,
  reducers: {
    // Reducer to update the MessageList
    updateMessageList(state, action: PayloadAction<MessageRecord[]>) {
      // return action.payload;
      return [...action.payload, ...state]; // Prepend the new messagelist at start of the messagelist
    },
    
  prependMessageList(state, action: PayloadAction<MessageRecord[]>) {
      return [...action.payload, ...state];
    },
   
    updateMessagesByIds(
      state,
      action: PayloadAction<{
        message_id: number;
        message: string;
        delete_from_everyone: boolean;
        user_id?: string;
      }>, // single object in payload
    ) {
      return state.map((message) => {
        if (message.message_id === action.payload.message_id) {
          return {
            ...message,
            message: action.payload.message,
            delete_from_everyone: action.payload.delete_from_everyone,
            // message_type: "delete_from_everyone", // Uncomment if needed
          };
        }
        return message;
      });
    },

    updateMessagesReadStatusByIds(
      state,
      action: PayloadAction<{
        message_id: number;
      }>, // single object in payload
    ) {
      return state.map((message) => {
        if (message.message_id == action.payload.message_id) {
          return {
            ...message,
            message_read: 1,
          };
        }
        return message;
      });
    },

    // Reducer to append a single object with date check 

    appendMessageWithDateCheck(state, action: PayloadAction<MessageRecord>) {
  return [...state, action.payload]; // ✅ Immutable update
},

     clearMessageList() {
      return [];
    },
  },
});

// Export the reducer and actions
export default MessageListSlice.reducer;
export const {
  updateMessageList,
  appendMessageWithDateCheck,
  prependMessageList,
  updateMessagesByIds,
  updateMessagesReadStatusByIds,
  clearMessageList
} = MessageListSlice.actions;
