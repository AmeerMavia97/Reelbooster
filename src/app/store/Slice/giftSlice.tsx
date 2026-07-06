import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Gift {
  user_id: number;
  user_name: string;
  full_name: string;
  profile_pic?: string;
  giftName: string;
  gift_thumbnail: string;
  coinsValue: number;
  receivedAt: number;
}

interface GiftState {
  gifts: Gift[];
}

const initialState: GiftState = {
  gifts: [],
};

const giftSlice = createSlice({
  name: "gifts",
  initialState,
  reducers: {
    addGift: (state, action: PayloadAction<Gift>) => {
      const gift = action.payload;
      state.gifts.unshift(gift);
    },

    clearGifts: (state) => {
      state.gifts = [];
    },
  },
});

export const { addGift, clearGifts } = giftSlice.actions;
export default giftSlice.reducer;
