"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { socketInstance } from "../socket/socket";
import {
  updatePagination,
  setIsLoading,
  setIsAtTop,
} from "../store/Slice/MessageOptionsSlice";
import { prependMessageList } from "../store/Slice/MessageListSlice";
import { MessageListRes } from "../types/MessageListType";
import { ClipLoader } from "react-spinners";

export default function LoadMoreMessages() {
  const dispatch = useAppDispatch();
  const messageListDetails = useAppSelector((state) => state.MessageOptions);

  const { currentPage, totalPages, messageListAtTop, isMessageLoading } =
    useAppSelector((state) => state.MessageOptions);
  const currentConversation = useAppSelector(
    (state) => state.CurrentConversation
  );

  useEffect(() => {
    if (!messageListAtTop || isMessageLoading) return;
    if (currentPage >= totalPages) return;

    const socket = socketInstance();
    if (!socket) return;

    dispatch(setIsLoading(true));

    // socket.emit("message_list", {
    //   chat_id: currentConversation.chat_id,
    //   page: currentPage + 1, // ✅ Dynamic page increment
    //   pageSize: 1000,
    // });

    const handleMessageList = (res: MessageListRes) => {
      dispatch(prependMessageList(res.Records)); // ✅ Prepend to existing list
      dispatch(
        updatePagination({
          currentPage: res.Pagination.current_page,
          totalPages: res.Pagination.total_pages,
        })
      );
      dispatch(setIsLoading(false));
      dispatch(setIsAtTop(false)); // reset scroll trigger
    };

    // socket.once("message_list", handleMessageList);

    return () => {
      // socket.off("message_list", handleMessageList);
    };
  }, [
    messageListAtTop,
    currentPage,
    totalPages,
    isMessageLoading,
    currentConversation,
    dispatch,
  ]);

  return (
    <>
      {messageListDetails.isMoreMessageLoading && (
        <div className="flex h-14 w-full justify-center">
          <ClipLoader size={23} color="green" />
        </div>
      )}
    </>
  );
}
