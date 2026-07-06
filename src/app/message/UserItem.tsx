import Image from "next/image";
import { PeerUserData, Messages } from "../types/ChatListType";
import { useAppSelector } from "../utils/hooks";
import Cookies from "js-cookie";

interface UserItemProps {
  user: PeerUserData;
  chatId: number;
  latestMessage?: Messages;
  unseenCount?: number; // ✅ New prop for unseen message count
  onClick?: () => void;
}

const UserItem: React.FC<UserItemProps> = ({
  user,
  chatId,
  latestMessage,
  unseenCount,
  onClick,
}) => {
  // ✅ flat array now
  const onlineUsers = useAppSelector((state) => state.OnlineUserList);

  const isOnline =
    user && Array.isArray(onlineUsers)
      ? onlineUsers.some((u) => u.user_id === user.user_id)
      : false;
  const isTyping = useAppSelector((state) => state.SendMessageData.typing);
  const chat_id = useAppSelector((state) => state.SendMessageData.chat_id);

  
  return (
    <>
      <div
        onClick={onClick}
        className="flex xl:gap-4 lg:gap-2 md:gap-0 gap-4 py-4 border-b px-3 border-[#EFEFEF] cursor-pointer"
      >
        <div className="relative flex-shrink-0 md:px-3 lg:px-0">
          <Image
            src={user.profile_pic}
            alt="profile"
            width={48}
            height={48}
            className="w-[44px] h-[44px] rounded-full object-cover"
          />

          {isOnline && (
            <>
              {isOnline && (
                <div className="w-3 h-3 rounded-full bg-green-600 bottom-0 right-0 absolute"></div>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col flex-grow overflow-hidden justify-center">
          <div className="flex justify-between items-center w-full">
            <h2 className="lg:text-sm text-xs font-semibold text-dark font-gilroy_semibold truncate">
              {user.full_name}
            </h2>

            {/* time and read unread tick */}
            <div className="flex flex-col items-center">
              {/* time */}
              <p className="text-[10px] font-poppins text-[#747474]">
                {latestMessage?.updatedAt
                  ? new Date(latestMessage.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </p>
              {/* tick */}
            </div>
          </div>

          {/* unseen message count  */}
          {/* {latestMessage?.} */}
          <div className="flex justify-between items-center w-full">
            {isTyping && chatId == chat_id ? (
              <>
                <p className="text-main-green text-xs max-w-3xs font-gilroy_md line-clamp-1 truncate">
                  typing...
                </p>
              </>
            ) : (
              <>
                {latestMessage?.message_type === "text" ? (
                  <>
                    <p className="text-[#747474] text-xs max-w-3xs font-gilroy_md line-clamp-1 truncate">
                      {latestMessage?.message_content}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[#747474] text-xs font-gilroy_md line-clamp-1 truncate">
                      {latestMessage?.message_type}
                    </p>
                  </>
                )}
              </>
            )}

            {unseenCount && unseenCount > 0 ? (
              <div className="bg-main-green flex items-center justify-center p-1 w-4.5 h-4.5 rounded-full">
                <span className="text-primary text-[8px] font-medium">
                  {unseenCount}
                </span>
              </div>
            ) : (
              <>
               
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserItem;
