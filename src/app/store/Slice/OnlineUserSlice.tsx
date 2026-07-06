import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OnlineUsers } from "@/app/types/OnlineUser";

const initialState: OnlineUsers[] = [];

const OnlineUserSlice = createSlice({
  name: "OnlineUserList",
  initialState,
  reducers: {
    setOnlineUsers: (_state, action: PayloadAction<OnlineUsers[]>) => {
      return action.payload; // always replace with an array
    },
    addOnlineUser: (state, action: PayloadAction<OnlineUsers>) => {
      const exists = state.find((user) => user.user_id === action.payload.user_id);
      if (!exists) {
        state.push(action.payload);
      }
    },
    removeOnlineUser: (state, action: PayloadAction<number>) => {
      return state.filter((user) => user.user_id !== action.payload);
    },

    
  },
});

export default OnlineUserSlice.reducer;
export const { setOnlineUsers, addOnlineUser, removeOnlineUser } =
  OnlineUserSlice.actions;
