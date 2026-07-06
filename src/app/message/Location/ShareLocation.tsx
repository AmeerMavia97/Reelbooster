import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { MessageRecord } from "@/app/types/MessageListType";
import useApiPost from "@/app/hooks/postData";
import { socketInstance } from "@/app/socket/socket";
// import scrollToMessage from "../../../utils/scrollToMessage";
import { updateSendMessageData } from "@/app/store/Slice/SendMessageSlice";
import { updateCurrentConversation } from "@/app/store/Slice/CurrentConversationSlice";

import {
  appendMessageWithDateCheck
} from "@/app/store/Slice/MessageListSlice";
import { updateMessageOptions } from "@/app/store/Slice/MessageOptionsSlice";
import Image from "next/image";

export default function ShareLocation() {
  const sendMessageData = useAppSelector((state) => state.SendMessageData);

  const { postData } = useApiPost();
  const dispatch = useAppDispatch();
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation
  );
  
  
  async function shareLocationApiCall() {
   

    // Show instantly in UI
    // dispatch(prependMessageList([tempMessage]));

    const messageFormData = new FormData();

    if (
      currentConversationData.chat_id !== -1 &&
      currentConversationData.chat_id !== 0
    ) {
      messageFormData.append(
        "chat_id",
        String(currentConversationData.chat_id)
      );
    } else {
      messageFormData.append(
        "user_id",
        String(currentConversationData.PeerUserData?.user_id)
      );
      messageFormData.append("chat_type", "private");
    }

    messageFormData.append(
      "message_type",
      String(sendMessageData.message_type || "location")
    );
    messageFormData.set(
      "message_content",
      `${sendMessageData.latitude},${sendMessageData.longitude}`
    );

    try {
      const sendMessageRes: MessageRecord = await postData(
        "/chat/send-message",
        messageFormData,
        "multipart/form-data"
      );

      if (sendMessageRes) {
        if (
          currentConversationData.chat_id === 0 ||
          currentConversationData.chat_id === -1
        ) {
          dispatch(
            updateCurrentConversation({
              chat_id: sendMessageRes.chat_id,
            })
          );
        }

        dispatch(appendMessageWithDateCheck(sendMessageRes));
        dispatch(updateMessageOptions({ show_send_location_modal: false }));

        dispatch(
          updateSendMessageData({
            message: "",
            message_type: "",
            reply_id: 0,
          })
        );

        socketInstance().emit("chat_list", {});
      }
    } catch (err) {
      // Optional: remove temp message or mark as failed
    }
  }

  return (
    <div className="relative w-[97%]">
      <div className="absolute -bottom-3 left-2 w-full">
        <div className="mx-auto flex h-14 items-center justify-between rounded-lg border border-[#FCC604] bg-[#FFF8E0] px-2">
          <div className="flex items-center gap-2">
            <Image
              className="h-7 w-7 object-contain"
              src="/chat/border_location.png"
              alt=""
              width={25}
              height={25}
            />
            <span className="text-sm text-dark">{sendMessageData.message}</span>
          </div>
          <div>
            <button
              onClick={shareLocationApiCall}
              className={"!h-9 text-dark w-fit text-nowrap rounded-xl !px-4 !text-sm"}
            >
              Share location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
