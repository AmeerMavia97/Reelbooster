import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageRecord } from "@/app/types/MessageListType";

interface MessageOptionsState {
  selectMessage: boolean;
  message_list: MessageRecord[];
  showModal: boolean;
  modalName:
    | "clear_chat"
    | "delete_chat"
    | "report_user"
    | "block_user"
    | "remove_member"
    | "exit_from_group"
    | "delete_group"
    | "";
  title: string;
  description: string;
  totalPages: number;
  currentPage: number;
  isMessageLoading: boolean;
  isMoreMessageLoading: boolean;
  delete_message: boolean;
  delete_only_from_me: boolean;
  delete_from_every_one: boolean;
  show_forward_message_modal: boolean;
  show_create_poll_modal: boolean;
  show_view_poll_vote_modal: boolean;
  show_send_location_modal: boolean;
  message_id: number;
  show_select_about_modal: boolean;
  forward_message: boolean;
  show_pin_message_modal: boolean;
  messageListAtTop: boolean;
  show_all_star_messages: boolean;
  pinned_duration?: "1_day" | "7_days" | "1_month" | "lifetime";
}

// const initialState: MessageOptionsState = {
//   currentPage: 1,
//   totalPages: 1,
//   isMessageLoading: false,
//   isMoreMessageLoading:false,
//   messageListAtTop: false,
// };
const initialState: MessageOptionsState = {
  selectMessage: false,
  message_list: [],
  showModal: false,
  modalName: "",
  title: "",
  description: "",
  totalPages: 0,
  currentPage: 1,
  isMessageLoading: false,
  isMoreMessageLoading: false,
  delete_message: false,
  delete_only_from_me: false,
  forward_message: false,
  show_forward_message_modal: false,
  show_pin_message_modal: false,
  show_select_about_modal: false,
  delete_from_every_one: false,
  messageListAtTop: false,
  show_all_star_messages: false,
  show_send_location_modal: false,
  pinned_duration: "1_day",
  show_create_poll_modal: false,
  show_view_poll_vote_modal: false,
  message_id: 0,
};

const MessageOptionsSlice = createSlice({
  name: "MessageOptions",
  initialState,
  reducers: {
    updatePagination(state, action: PayloadAction<{ currentPage: number; totalPages: number }>) {
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
    },
     updateMessageOptions(
      state,
      action: PayloadAction<Partial<MessageOptionsState>>,
    ) {
      return { ...state, ...action.payload };
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isMessageLoading = action.payload;
    },
    setIsAtTop(state, action: PayloadAction<boolean>) {
      state.messageListAtTop = action.payload;
    },
    resetPagination(state) {
      state.currentPage = 1;
      state.totalPages = 1;
      state.isMessageLoading = false;
      state.messageListAtTop = false;
    },
  },
});

export const {
  updateMessageOptions,
  updatePagination,
  setIsLoading,
  setIsAtTop,
  resetPagination,
} = MessageOptionsSlice.actions;

export default MessageOptionsSlice.reducer;
