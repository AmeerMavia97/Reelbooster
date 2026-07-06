// bankScreenSlice.ts
import { createSlice } from "@reduxjs/toolkit";

type BankScreenState = {
  activeScreen: "add" | "edit" | "";
};

const initialState: BankScreenState = { activeScreen: "" };

const bankScreenSlice = createSlice({
  name: "bankScreen",
  initialState,
  reducers: {
    setScreen: (state, action) => {
      state.activeScreen = action.payload;
    },
  },
});

export const { setScreen } = bankScreenSlice.actions;
export default bankScreenSlice.reducer;
