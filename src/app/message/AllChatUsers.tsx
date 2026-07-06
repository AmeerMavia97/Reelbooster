"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import UserItem from "./UserItem";
import { ChatListRes, Messages, Record } from "../types/ChatListType";
import { updateCurrentConversation } from "../store/Slice/CurrentConversationSlice";
import { socketInstance } from "../socket/socket";
import { resetPagination } from "../store/Slice/MessageOptionsSlice";
import { clearMessageList } from "../store/Slice/MessageListSlice";
import { updateChatList } from "../store/Slice/ChatListSlice";
import { setChatId } from "../store/Slice/setChatIdMessageLoading";

function AllChatUsers({ onUserClick }: { onUserClick?: () => void }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const chatList = useAppSelector((state) => state.chatList);
  const currentChatId = useAppSelector((state) => state.CurrentConversation);

  const handleChatClick = (record: Record) => {
    if (record.chat_id === currentChatId.chat_id) return; // 🚫 Don't re-select same chat

    const chat = chatList.find((c) =>
      c.Records.some((r) => r.chat_id === record.chat_id)
    );
    if (!chat) return;

    const peerUser = chat.PeerUserData;

    dispatch(resetPagination());
    dispatch(clearMessageList());

    dispatch(
      updateCurrentConversation({
        ...record,
        PeerUserData: peerUser,
      })
    );

    dispatch(setChatId(record.chat_id));
  };

  useEffect(() => {
    const socket = socketInstance();

    const handleChatListUpdate = (ChatList: ChatListRes) => {
      dispatch(updateChatList(ChatList.Chats));
    };

    socket.on("chat_list", handleChatListUpdate);

    // Fetch immediately on mount
    socket.emit("chat_list");

    return () => {
      socket.off("chat_list", handleChatListUpdate);
    };
  }, [dispatch]);

  // Auto-select the first chat if not a new conversation and no current chat selected
  useEffect(() => {
    if (
      chatList.length > 0 &&
      !currentChatId.chat_id &&
      !currentChatId?.PeerUserData
    ) {
      // when i click on 
      const firstChat = chatList[0];
      const firstRecord = firstChat?.Records?.[0];
      if (firstRecord) handleChatClick(firstRecord);
    }
  }, [chatList, currentChatId]);

  // ✅ include `currentChatId.chat_id` in deps

  return (
    <div className="flex flex-col sticky top-0 bg-primary xl:pt-16">
      {/* Header */}
      <div className="flex gap-2 sm:p-3 px-3 py-2 flex-shrink-0">
        <button onClick={() => router.push("/")} className="sm:hidden" />
        <h2 className="font-gilroy_semibold text-lg text-dark font-semibold">
          Sohbet
        </h2>
      </div>

      {/* Search bar */}
      <div className="relative sm:p-3 px-2 flex-shrink-0">
        <div className="absolute top-1/2 left-5 transform -translate-y-1/2 p-2 flex items-center">
          <Image
            src="/SidebarIcons/search.png"
            alt="Search"
            className="w-5 h-5"
            width={10}
            height={10}
          />
        </div>
        <input
          type="text"
          className="border border-[#EEEEEE] bg-dark/[0.02] rounded-lg w-full py-2 my-1 pl-12 placeholder:text-sm text-dark placeholder:text-[#A4A4A4] focus:outline-none focus:ring-1 focus:ring-gray-600"
          placeholder="Search for a User"
        />
      </div>
      {/* Chat List */}
      <div className="overflow-y-auto flex-grow">
        {chatList.length > 0 ? (
          chatList.map((chat, index) => {
            const user = chat.PeerUserData;
            const record = chat.Records[0]; // Or logic for latest/first record
            const latestMessage: Messages | undefined =
              record?.Messages?.[record.Messages.length - 1];

            return (
              <>
                <UserItem
                  key={user.user_id + "-" + index}
                  user={user}
                  latestMessage={latestMessage}
                  chatId={record.chat_id}
                  unseenCount={record.unseen_count} // 👈 pass unseen count here
                  onClick={() => {
                    if (record) handleChatClick(record);
                    if (onUserClick) onUserClick(); // trigger toggle on mobile
                  }}
                />
              </>
            );
          })
        ) : (
          <>
            <div className="flex flex-col justify-center min-h-200 items-center place-items-center">
              {/* <Image
                src="/home/Empty.png"
                className="w-[50px] h-[50px]"
                alt="no post"
                width={400}
                height={400}
              /> */}

              <p className="text-dark text-center text-sm">No Chats Found.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AllChatUsers;

