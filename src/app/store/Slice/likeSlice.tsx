import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface LikeUser {
  user_id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  likeCount: number; // 👈 per-user like count
}

interface LikeState {
  users: Record<number, LikeUser>;
  totalLikes: number; // 👈 total likes from all users
}


const initialState: LikeState = {
  users: {},
  totalLikes: 0,
};

  const MyUserId = Number(Cookies.get("Reelboost_user_id"));


const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    addLike: (state, action: PayloadAction<Omit<LikeUser, "likeCount">>) => {
      const user = action.payload;

      // 🔁 If user already exists → increase only his count
      if (state.users[user.user_id]) {
        state.users[user.user_id].likeCount += 1;
      } else {
        // 🆕 First time user
        state.users[user.user_id] = {
          ...user,
          likeCount: 1,
        };
      }

      // 🔢 Increase global count always
      state.totalLikes += 1;
    },
  },
});

export const { addLike } = likeSlice.actions;
export default likeSlice.reducer;