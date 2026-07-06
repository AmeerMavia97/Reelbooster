import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clear } from "console";

interface DateRangeState {
  startDate: number | null; // store as timestamp
  endDate: number | null;
}

const initialState: DateRangeState = {
  startDate: null,
  endDate: null,
};

const dateRangeSlice = createSlice({
  name: "dateRange",
  initialState,
  reducers: {
    setDateRange: (
      state,
      action: PayloadAction<{ startDate: Date; endDate: Date }>
    ) => {
      state.startDate = action.payload.startDate.getTime();
      state.endDate = action.payload.endDate.getTime();
    },
    clearDateRange: (state) => {
      state.startDate = null;
      state.endDate = null;
    }
  },
});

export const { setDateRange, clearDateRange } = dateRangeSlice.actions;
export default dateRangeSlice.reducer;
