// src/store/Slice/GiftSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GiftState {
  selectedCategoryId: number | null;
  selectedGiftId: number | null;
  selectedGiftValue: number; // price of selected gift
  selectedGiftImage: string | null; // gift image
  quantity: number;
  total: number; // selectedGiftValue * quantity
}

const initialState: GiftState = {
  selectedCategoryId: null,
  selectedGiftId: null,
  selectedGiftValue: 0,
  selectedGiftImage: null,
  quantity: 1,
  total: 0,
};

const giftSlice = createSlice({
  name: "gift",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<number>) => {
      state.selectedCategoryId = action.payload;
      state.selectedGiftId = null;
      state.selectedGiftValue = 0;
      state.selectedGiftImage = null;
      state.quantity = 1;
      state.total = 0;
    },
    setSelectedGift: (
      state,
      action: PayloadAction<{ id: number; value: number; image: string }>
    ) => {
      state.selectedGiftId = action.payload.id;
      state.selectedGiftValue = action.payload.value;
      state.selectedGiftImage = action.payload.image;
      state.quantity = 1;
      state.total = action.payload.value; // reset total
    },
    incrementQuantity: (state) => {
      state.quantity += 1;
      state.total = state.quantity * state.selectedGiftValue;
    },
    decrementQuantity: (state) => {
      if (state.quantity > 1) {
        state.quantity -= 1;
        state.total = state.quantity * state.selectedGiftValue;
      }
    },
    resetGift: (state) => {
      state.selectedCategoryId = null;
      state.selectedGiftId = null;
      state.selectedGiftValue = 0;
      state.selectedGiftImage = null;
      state.quantity = 1;
      state.total = 0;
    },
  },
});

export const {
  setSelectedCategory,
  setSelectedGift,
  incrementQuantity,
  decrementQuantity,
  resetGift,
} = giftSlice.actions;

export default giftSlice.reducer;
