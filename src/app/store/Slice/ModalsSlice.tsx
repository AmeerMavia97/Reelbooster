import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  Signin: boolean;
  Signup: boolean;
  Avtar: boolean;
  OTP: boolean;
  Profile: boolean; //for the chat and profile option in header
  LogoutProfile: boolean;
  SearchHashtag: boolean;
  SearchAccounts: boolean;
  ShareReel: boolean;
  EditProfile: boolean;
  MyFollowers: boolean;
  MyFollowing: boolean;
  OtherUserFollowers: boolean;
  OtherUserFollowing: boolean;
  Logout: boolean;
  ReportUser: boolean;
  ReportConfirmation: boolean;
  BlockUser: boolean;
  Options: boolean; //report and block
  OpenImageFromChat: boolean;
  OpenVideoFromChat: boolean;
  MainSearch: boolean;
  BlockedList: boolean;
  DeleteAccount: boolean;
  Notification: boolean;
  DeleteSocial: boolean;
  ViewAudio: boolean;
  LivePopup: boolean;
  LeaveLive: boolean;
  FreeCoin: boolean;
  SendGift:boolean;
  InsufficientBalance:boolean;
  GiftSentSuccessfully:boolean;
  PaymentGateway:boolean;
  RechargeSuccessful:boolean;
  MyGifts:boolean;
  PaymentGatewayForWithdraw:boolean;
  HosterViewModal:boolean;
  ViewstreamingPayment:boolean;
  ViewstreamingcenterHosterDetail:boolean;
  StopLiveModal:boolean;
  // modals to upload reel
  UploadReel: boolean;
  UploadVideo: boolean;
  RechargePlan: boolean;
  TrimVideo: boolean;
  MusicList: boolean;
// modals for live new =============
   GoToliveModal:boolean;
  LiveCountdownModal:boolean;
}

const initialState: ModalState = {
  Signin: false,
  StopLiveModal:false,
  ViewstreamingPayment:false,
  HosterViewModal:false,
  ViewstreamingcenterHosterDetail:false,
  Signup: false,
  Avtar: false,
  OTP: false,
  Profile: false,
  LogoutProfile: false,
  SearchHashtag: false,
  SearchAccounts: false,
  ShareReel: false,
  EditProfile: false,
  MyFollowers: false,
  MyFollowing: false,
  OtherUserFollowers: false,
  OtherUserFollowing: false,
  Logout: false,
  ReportUser: false,
  ReportConfirmation: false,
  BlockUser: false,
  Options: false,
  OpenImageFromChat: false,
  OpenVideoFromChat: false,
  MainSearch: false,
  BlockedList: false,
  DeleteAccount: false,
  Notification: false,
  DeleteSocial: false,
  ViewAudio: false,
  LivePopup: false,
  LeaveLive: false,
  FreeCoin: true,
  SendGift:false,
  InsufficientBalance:false,
  GiftSentSuccessfully:false,
  PaymentGateway:false,
  RechargeSuccessful:false,
  MyGifts:false,
  PaymentGatewayForWithdraw:false,

  UploadReel: false,
  UploadVideo: false,
  RechargePlan: false,
  TrimVideo: false,
  MusicList: false,

  // modals for live new =============
  GoToliveModal:false,
  LiveCountdownModal:false,
};

const dialogSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    showModal: (state, action: PayloadAction<keyof ModalState>) => {
      state[action.payload] = true;
    },
    hideModal: (state, action: PayloadAction<keyof ModalState>) => {
      state[action.payload] = false;
    },
  },
});

export const { showModal, hideModal } = dialogSlice.actions;
export default dialogSlice.reducer;
