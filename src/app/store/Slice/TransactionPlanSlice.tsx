// src/app/store/slices/transactionPlansSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TransactionPlanRecord } from "@/app/types/Gift";

interface TransactionPlansState {
  plans: TransactionPlanRecord[];
  selectedPlanId: number | null;
  total_money:number | null;
}

const initialState: TransactionPlansState = {
  plans: [],
  selectedPlanId: null,
  total_money:0,
};

const transactionPlansSlice = createSlice({
  name: "transactionPlans",
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<TransactionPlanRecord[]>) => {
      state.plans = action.payload;
    },
    appendPlans: (state, action: PayloadAction<TransactionPlanRecord[]>) => {
      // avoid duplicates
      const newPlans = action.payload.filter(
        (rec) => !state.plans.some((p) => p.plan_id === rec.plan_id)
      );
      state.plans.push(...newPlans);
    },
    setSelectedPlanId: (state, action: PayloadAction<number | null>) => {
      state.selectedPlanId = action.payload;
    },
    setSelectedPlanAmount: (state, action: PayloadAction<number>) => {
      state.total_money = action.payload;
    },
    clearPlans: (state) => {
      state.plans = [];
      state.selectedPlanId = null;
    },
  },
});

export const { setPlans, appendPlans, setSelectedPlanId,setSelectedPlanAmount, clearPlans } =
  transactionPlansSlice.actions;

export default transactionPlansSlice.reducer;
