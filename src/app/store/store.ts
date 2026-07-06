import { configureStore } from "@reduxjs/toolkit";
import dialogSlice from './Slice/ModalsSlice'
import commentSlice from './Slice/ActiveCommentBox'
import userSlice from './Slice/PhoneEmailSlice'
import userDataSlice from './Slice/UserDataSlice'
import userIdSlice from './Slice/UserIdHashtagIdSlice'
import followFollowingSlice from './Slice/FollowFollowingCount'
import followSlice from './Slice/fetchFollowReelsSlice'
import selectedReelSlice from './Slice/SelectedReelDetail';
import getCommentSlice from './Slice/commentSlice'
import commentReplySlice from './Slice/storeCommentsReplies'
import commentAddedSlice from './Slice/handleCommentCount';
import ChatListSlice from './Slice/ChatListSlice'
import CurrentConversationSlice from './Slice/CurrentConversationSlice';
import MessageListSlice from './Slice/MessageListSlice';
import SendMessageSlice from './Slice/SendMessageSlice';
import MessageOptionsSlice from './Slice/MessageOptionsSlice'
import OnlineUserSlice from './Slice/OnlineUserSlice';
import reportSlice from './Slice/SetReportTextIdSlice';
import userReelsSlice from './Slice/UserReelsSlice';
import userLikesSlice from './Slice/UserLikesSlice';
import mediaSlice from './Slice/MediaSlice';
import reelsSlice from './Slice/HomePageReelsSlice';
import ViewAudioSlice from './Slice/ViewAudioSlice';
import liveSice from './Slice/LiveSlice';
import seenStatusSlice from './Slice/messageSeenStatusSlice';
import giftSlice from './Slice/selectedGiftCategorySlice';
import transactionPlans from './Slice/TransactionPlanSlice'
import userGiftsSlice from './Slice/UserGiftsSlice'
import followersSlice from './Slice/FollowersSlice'
import followingSlice from './Slice/FollowingSlice'
import dateRangeSlice from './Slice/DateRangeSlice'
import bankScreenSlice from './Slice/BankScreenSlice';
import selectedChatSlice from './Slice/setChatIdMessageLoading'
import likeSlice from './Slice/likeSlice'
import  giftsslice    from  "./Slice/giftSlice"
import viewStreamingSlice from  "./Slice/ViewStreamingSlice"
import uiSliceReducer from "./Slice/uiSlice"
import viewStreamSliceReducer from  "./Slice/viewStreamSlice"
// Create the Redux store
export const store = configureStore({
  reducer: {
    // Add reducers here
    viewStream:viewStreamSliceReducer,
    modals:dialogSlice,
    ui:uiSliceReducer,
    viewStreaming:viewStreamingSlice,
    gifts:giftsslice,
    comment:commentSlice,
    user:userSlice,
    userData:userDataSlice,
    userId:userIdSlice,
    followFollowingSlice:followFollowingSlice,
    follow:followSlice,
    selectedReel:selectedReelSlice,
    getComment:getCommentSlice,
    comments:commentReplySlice,
    commentAdded:commentAddedSlice,
    chatList:ChatListSlice,
    CurrentConversation:CurrentConversationSlice,
    MessageList:MessageListSlice,
    SendMessageData:SendMessageSlice,
    MessageOptions:MessageOptionsSlice,
    OnlineUserList:OnlineUserSlice,
    ReportType:reportSlice,
    userReels:userReelsSlice,
    userLikes:userLikesSlice,
    media:mediaSlice,
    reels:reelsSlice,
    music:ViewAudioSlice,
    live:liveSice,
    SeenStatus:seenStatusSlice,
    gift:giftSlice,
    transactionPlans:transactionPlans,
    userGifts:userGiftsSlice,
    followers:followersSlice,
    following:followingSlice,
    dateRange:dateRangeSlice,
    bankScreen:bankScreenSlice,
    selectedChat:selectedChatSlice,
     // slice for live ===================================
    likes:likeSlice,
  },


});

export type AppStore = typeof store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
