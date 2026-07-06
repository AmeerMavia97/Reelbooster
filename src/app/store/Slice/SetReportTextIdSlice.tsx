
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  ReportUser: boolean;
  ReportConfirmation: boolean;
  selectedReport?: {
    id: number;
    text: string;
  };
}

const initialState: ModalState = {
  ReportUser: false,
  ReportConfirmation: false,
};

const reportSlice = createSlice({
  name: "ReportType",
  initialState,
  reducers: {
   
    setSelectedReport: (state, action: PayloadAction<{ id: number; text: string }>) => {
      state.selectedReport = action.payload;
    },
    clearSelectedReport: (state) => {
      state.selectedReport = undefined;
    },
  },
});

export const {  setSelectedReport, clearSelectedReport } =
  reportSlice.actions;

export default reportSlice.reducer;
