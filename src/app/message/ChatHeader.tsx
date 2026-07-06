"use client";
import React from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { useRouter } from "next/navigation";
import { setUserId } from "../store/Slice/UserIdHashtagIdSlice";
import { IoIosArrowBack } from "react-icons/io";

interface ChatHeaderProps {
  onBack?: () => void; // callback for mobile back
}

function ChatHeader({ onBack }: ChatHeaderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentConversation = useAppSelector(
    (state) => state.CurrentConversation
  );

  const peerUser = currentConversation.PeerUserData;

  // online users
  const onlineUsers = useAppSelector((state) => state.OnlineUserList);
  const chat_id = useAppSelector((state) => state.SendMessageData.chat_id);
  const chatId = currentConversation.chat_id;
  const isOnline =
    peerUser && Array.isArray(onlineUsers)
      ? onlineUsers.some((u) => u.user_id === peerUser.user_id)
      : false;

  const isTyping = useAppSelector((state) => state.SendMessageData.typing);

  const handleUserRoute = (userId: number) => {
    dispatch(setUserId(userId));
    router.push(`/profile/${userId}`);
  };

  // helper for last seen
  function formatLastSeen(timestamp: string | null) {
    if (!timestamp) return "Offline";

    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return !peerUser ? null : (
    <div className="flex xl:mt-16 justify-between sm:px-6 px-4 py-4 border border-[#E5E7EB]">
      <div
        className="flex items-center sm:gap-2 gap-1 cursor-pointer"
        onClick={() => handleUserRoute(peerUser.user_id)}
      >
        <button onClick={onBack} className="sm:hidden block text-dark pr-4">
          <IoIosArrowBack />
        </button>

        <Image
          src={peerUser.profile_pic}
          alt="profile"
          className="w-9 h-9 rounded-full object-cover"
          height={100}
          width={100}
        />

        <div className="ml-2 flex flex-col">
          <h2 className="font-semibold text-sm text-dark font-gilroy_bold cursor-pointer">
            {peerUser.full_name}
          </h2>
          {isTyping && chatId == chat_id ? (
            <p className="font-gilroy_md text-xs text-main-green">typing...</p>
          ) : (
            <span
              className={`text-xs  ${
                isOnline ? "text-main-green" : "text-dark"
              }`}
            >
              {isOnline
                ? "Online"
                : `Last seen at ${formatLastSeen(peerUser.updatedAt)}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
