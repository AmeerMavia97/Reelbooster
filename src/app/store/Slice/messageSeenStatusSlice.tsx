// store/Slice/SeenStatusSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SeenStatusPayload = {
  message_id: number;
  message_seen_status: string;
};

interface SeenStatusState {
  seenMessages: Record<number, string>; // message_id -> "seen"
}

const initialState: SeenStatusState = {
  seenMessages: {},
};

const seenStatusSlice = createSlice({
  name: "SeenStatus",
  initialState,
  reducers: {
    updateMessageSeenStatus: (
      state,
      action: PayloadAction<SeenStatusPayload>
    ) => {
      const { message_id, message_seen_status } = action.payload;
      state.seenMessages[message_id] = message_seen_status;
    },
  },
});

export const { updateMessageSeenStatus } = seenStatusSlice.actions;
export default seenStatusSlice.reducer;
