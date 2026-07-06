// store/Slice/UserSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRecord } from "../../types/ResTypes";

interface UserState {
  user: UserRecord | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserRecord>) {
      state.user = action.payload;
    },
    updateUserData(state, action: PayloadAction<Partial<UserRecord>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUserData, updateUserData } = userSlice.actions;
export default userSlice.reducer;
