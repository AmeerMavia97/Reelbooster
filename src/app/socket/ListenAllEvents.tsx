"use client";

import { useEffect, useRef } from "react";
import Cookies from "js-cookie";

import { socketInstance } from "./socket";
import { useAppDispatch, useAppSelector } from "../utils/hooks";

import { ChatListRes } from "../types/ChatListType";
import { MessageListRes } from "../types/MessageListType";
import { MessagesSeenStatus, OnlineUsers } from "../types/OnlineUser";
import { JoinLive, LiveRecord } from "../types/LiveReels";

import { updateChatList } from "../store/Slice/ChatListSlice";
import { updateMessageList } from "../store/Slice/MessageListSlice";
import { setMessageLoading } from "../store/Slice/setChatIdMessageLoading";
import {
  addOnlineUser,
  removeOnlineUser,
  setOnlineUsers,
} from "../store/Slice/OnlineUserSlice";
import { updateTypingState } from "../store/Slice/SendMessageSlice";
import { updateMessageSeenStatus } from "../store/Slice/messageSeenStatusSlice";
import { setJoinLiveResponse, setLives } from "../store/Slice/LiveSlice";

import usePeerId from "../hooks/usePeerId";
import { addGift } from "../store/Slice/giftSlice";
import { normalizeMediaUrlsDeep } from "../utils/mediaUrl";

export default function ListenAllEvents() {
  const dispatch = useAppDispatch();
  const socketRef = useRef<ReturnType<typeof socketInstance> | null>(null);
  const hasJoinedLiveRef = useRef(false);

  const page = 1;
  const pageSize = 1000;

  const currentChatId = useAppSelector((s) => s.selectedChat.chat_id);
  const openLiveModal = useAppSelector((s) => s.modals.LivePopup);
  const selectedLive = useAppSelector((s) => s.live.selectedLive);
  const socketRoomId = useAppSelector((s) => s.live.socket_room_id);

  const myUserId = Number(Cookies.get("Reelboost_user_id"));
  const peerId = usePeerId();

  /* ----------------------------------
   🔊 Unlock audio (once)
  ----------------------------------- */
  useEffect(() => {
    const unlock = () => {
      const audio = new Audio();
      audio.play().catch(() => {});
      document.removeEventListener("click", unlock);
    };
    document.addEventListener("click", unlock);
  }, []);

  /* ----------------------------------
   🔌 Socket Init & Global Listeners
  ----------------------------------- */
  useEffect(() => {
    const socket = socketInstance();
    if (!socket) return;

    socketRef.current = socket;

    /* Chat list */
    socket.emit("chat_list", { page, pageSize });

    socket.on("chat_list", (res: ChatListRes) => {
      dispatch(updateChatList(normalizeMediaUrlsDeep(res.Chats)));
    });

    /* Message list */
    socket.on("message_list", (res: MessageListRes) => {
      dispatch(updateMessageList(normalizeMediaUrlsDeep(res.Records)));
      dispatch(setMessageLoading(true));
    });

    /* New incoming message */
    socket.on("recieve", (res: MessageListRes) => {
      if (!res?.Records?.length) return;

      dispatch(updateMessageList(normalizeMediaUrlsDeep(res.Records)));

      const latestMsg = res.Records[0];
      if (latestMsg.sender_id !== myUserId) {
        new Audio("/audio/achive-sound-132273.mp3").play();
      }
    });

    /* Online users */
    socket.on("initial_online_user", (users: OnlineUsers[]) => {
      dispatch(setOnlineUsers(normalizeMediaUrlsDeep(users || [])));
    });

    socket.on("online_user", (user: OnlineUsers) => {
      user && dispatch(addOnlineUser(normalizeMediaUrlsDeep(user)));
    });

    socket.on("offline_user", (data: { user_id: number })=> {
      data.user_id && dispatch(removeOnlineUser(data.user_id));
    });

    /* Typing */
    socket.on("typing", (data: { chat_id: number; typing: boolean }) => {
      dispatch(updateTypingState(data));
    });

    /* Seen status */
    socket.on("message_seen_status", (data: MessagesSeenStatus) => {
      if (data?.message_id && data.message_seen_status === "seen") {
        dispatch(updateMessageSeenStatus(data));
      }
    });

    /* 🔴 Live join */
    socket.on("join_live", (data: JoinLive) => {
      console.log("🟢 User joined live:", data);
      dispatch(setJoinLiveResponse(data));
    });

    /* 🔴 Live leave */
    socket.on("leave_live", (data: JoinLive) => {
      console.log("🔴 User left live:", data);  
      dispatch(setJoinLiveResponse(data));
    });
    // Socket event handler (assuming this is in the component or middleware where you listen for the socket event)
    socket.on("start_live", (data: { Records: LiveRecord[] }) => {
      console.log("🟢 Live started:", data);

      // Dispatch the action with the correct data
      dispatch(setLives(normalizeMediaUrlsDeep(data.Records)));
    });

    socket.on("stop_live", (data: { Records: LiveRecord[] }) => {
      console.log("🔴 Live stopped:", data);

      // Dispatch the action with the correct data
      // dispatch(setLives(data.Records));
    });


     socket.on("gift_recived", (data:any) => {
      console.log("🔴 Gift received:", data);
     dispatch(
    addGift({
      user_id: data.user_id,
      user_name: data.user_name,
      full_name: data.full_name,
      profile_pic: normalizeMediaUrlsDeep(data.profile_pic),
      giftName: data.GiftName,
      gift_thumbnail: normalizeMediaUrlsDeep(data.gift_thumbnail),
      coinsValue: data.Coinsvalues,
      receivedAt: Date.now(),
    })
  );
    });

    return () => {
      socket.removeAllListeners();
      socketRef.current = null;
    };
  }, [dispatch, myUserId]);

  /* ----------------------------------
   📩 Fetch messages on chat change
  ----------------------------------- */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !currentChatId) return;

    dispatch(setMessageLoading(true));

    socket.emit("message_list", {
      chat_id: currentChatId,
      page,
      pageSize,
    });
  }, [currentChatId, dispatch]);

  /* ----------------------------------
   🎥 Emit join_live (ONCE)
  ----------------------------------- */
  useEffect(() => {
    const socket = socketRef.current;

    if (
      !socket ||
      !openLiveModal ||
      !selectedLive ||
      !socketRoomId ||
      !peerId ||
      hasJoinedLiveRef.current
    )
      return;

    hasJoinedLiveRef.current = true;

    return () => {
      hasJoinedLiveRef.current = false;
    };
  }, [openLiveModal, selectedLive, socketRoomId, peerId, myUserId]);

  return null;
}
