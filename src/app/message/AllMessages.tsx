"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import Cookies from "js-cookie";
import GoogleMapReact from "google-map-react";
import {
  setIsAtTop,
} from "../store/Slice/MessageOptionsSlice";
import { ClipLoader } from "react-spinners";
import LoadMoreMessages from "./LoadMoreMessages";
import { MdLocationPin } from "react-icons/md";
import { showModal } from "../store/Slice/ModalsSlice";
import { setMediaUrl } from "../utils/MediaViewerUrl";
import OpenImageFromChat from "./OpenImageFromChat";
import OpenVideoComponent from "./OpenVideoFromChat";
import { MdWavingHand } from "react-icons/md";
import { setSelectedReel } from "../store/Slice/SelectedReelDetail";
import {
  setActiveCommentPostId,
  setActiveUserId,
} from "../store/Slice/ActiveCommentBox";
import ReelDetailsModal from "../explore/SelectedReelModal";
import { is } from "date-fns/locale";
import { Reel } from "../types/Reels";
import { normalizeMediaUrl } from "../utils/mediaUrl";

const myUserId = Cookies.get("Reelboost_user_id");

interface Message {
  createdAt: string;
  [key: string]: any; // other fields
}

interface GroupedMessages {
  date: string;
  msgs: Message[];
}


const formatTime = (utc: string) =>
  new Date(utc).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const groupMessagesByDate = (messages: any[]) => {
  const grouped: { [key: string]: any[] } = {}; 
  for (const msg of messages) {
    const date = new Date(msg.createdAt);
    if (isNaN(date.getTime())) continue; // Skip invalid date

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

    if (!grouped[formattedDate]) grouped[formattedDate] = [];
    grouped[formattedDate].push(msg);
  }

  return Object.entries(grouped).map(([date, msgs]) => ({ date, msgs }));
};

export default function AllMessages() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const isAtTop = useAppSelector(
    (state) => state.MessageOptions.messageListAtTop
  );
  const seenStatus = useAppSelector((state) => state.SeenStatus.seenMessages);

  const messages = useAppSelector((state) => state.MessageList);


  const currentConversation = useAppSelector(
    (state) => state.CurrentConversation
  );
  const { currentPage, totalPages, isMessageLoading } = useAppSelector(
    (state) => state.MessageOptions
  );

  const groupedMessages = groupMessagesByDate(
    [...messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentConversation.chat_id]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (
        container.scrollTop <= 50 &&
        currentPage < totalPages &&
        !isMessageLoading
      ) {
        dispatch(setIsAtTop(true)); // trigger LoadMoreMessages
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [currentPage, totalPages, isMessageLoading, dispatch]);

  

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const peerUser = currentConversation.PeerUserData;
  const isOpenImageFromChat = useAppSelector(
    (state) => state.modals.OpenImageFromChat
  );
  const [url, setUrl] = useState("");
  const isOpenVideoFromChat = useAppSelector(
    (state) => state.modals.OpenVideoFromChat
  );


  return (
    <>
      <LoadMoreMessages />

      <div
        className="flex-1 overflow-y-auto px-4 py-2 space-y-4 relative"
        ref={containerRef}
      >
        {isMessageLoading || (!peerUser && isMessageLoading) ? (
          <div className="flex justify-center items-center min-h-screen">
            <ClipLoader size={35} color="#4CAF50" />
          </div>
        ) : !peerUser ? (
          // No conversation selected
          <div className="flex flex-col items-center justify-center text-gray-500 text-sm py-96">
            {/* <Image src="/home/Empty.png" height={60} width={60} alt="empty" /> */}
            <p className="text-dark text-sm flex gap-2 place-items-center">
              Start Conversation{" "}
              <MdWavingHand className="text-yellow-500 text-xl" />
            </p>
          </div>
        ) : groupedMessages.length > 0 ? (
          // Messages list
          groupedMessages.map((group, index) => (
            <div key={index}>
              <div className="text-center text-xs text-gray-500 my-3">
                {group.date}
              </div>
              {group.msgs.map((msg) => {
                const isMine = msg.sender_id === parseInt(myUserId ?? "");
                const messageContent = normalizeMediaUrl(msg.message_content);
                const messageThumbnail = normalizeMediaUrl(
                  msg.message_thumbnail
                );
                return (
                  <div
                    key={msg.message_id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    } mb-3`}
                  >
                    <div className="flex items-end space-x-2.5 max-w-xs">
                      {!isMine && (
                        <Image
                          src={normalizeMediaUrl(msg.User?.profile_pic)}
                          width={20}
                          height={20}
                          className="rounded-full"
                          alt="avatar"
                        />
                      )}

                      <div>
                        {/* Text ========================================= */}
                        {msg.message_type === "text" && (
                          <div className="relative">
                            <div
                              className={`px-3 py-2 rounded-lg break-words max-w-[300px] text-sm text-primary ${
                                isMine
                                  ? "bg-main-green rounded-br-none"
                                  : "bg-dark-gray rounded-bl-none"
                              }`}
                            >
                              {msg.message_content}
                            </div>
                          </div>
                        )}

                        {/* Image =================================== */}
                        {msg.message_type === "image" && (
                          <Image
                            src={messageContent}
                            width={200}
                            height={200}
                            alt="Image"
                            className={`rounded-lg border cursor-pointer ${
                              isMine ? "bg-main-green" : "bg-opposite-color"
                            }`}
                            onClick={() => {
                              setMediaUrl(messageContent);
                              setUrl(messageContent);
                              dispatch(showModal("OpenImageFromChat"));
                            }}
                          />
                        )}

                        {/* Video ===================================== */}
                        {msg.message_type === "video" && (
                          <div className="relative w-[220px]">
                            {/* Video thumbnail */}
                            <Image
                              src={
                                messageThumbnail ||
                                "/placeholder-video.png"
                              }
                              width={220}
                              height={400}
                              alt="Video"
                              className="rounded-lg border cursor-pointer"
                              onClick={() => {
                                setMediaUrl(messageContent);
                                setUrl(messageContent);
                                dispatch(showModal("OpenVideoFromChat"));
                              }}
                            />

                            {/* Play/Pause overlay icon */}
                            <div
                              className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                              onClick={() => {
                                setMediaUrl(messageContent);
                                setUrl(messageContent);
                                dispatch(showModal("OpenVideoFromChat"));
                              }}
                            >
                              <Image
                                src="/chat/play.png" // change to pause.png when needed
                                alt="play"
                                width={35}
                                height={35}
                                className="drop-shadow-lg"
                              />
                            </div>
                          </div>
                        )}

                        {/* Document ================================== */}
                        {msg.message_type === "doc" && (
                          <div className="w-full max-w-80 rounded-[9px]">
                            <div className="flex items-center justify-between gap-2 rounded-[7px] p-4 px-6 text-sm bg-[#FAFAFA]">
                              <div className="flex items-center gap-2">
                                <Image
                                  className="h-10 w-10 object-cover"
                                  src="/chat/pdf_icons.png"
                                  alt=""
                                  width={100}
                                  height={100}
                                />
                                <div className="w-full text-dark line-clamp-2 max-w-60 text-xs overflow-hidden">
                                  {msg.message_content
                                    ?.split("/")
                                    .pop()
                                    ?.split("-")
                                    .slice(1)
                                    .join("-") || ""}
                                </div>
                              </div>

                              {/* Download button */}
                              <a
                                href={messageContent}
                                download={
                                  messageContent
                                    ?.split("/")
                                    .pop()
                                    ?.split("-")
                                    .slice(1)
                                    .join("-") || "document"
                                }
                              >
                                <Image
                                  src="/chat/Download_icon.png"
                                  className="h-6 w-6 cursor-pointer"
                                  alt="Download"
                                  width={1000}
                                  height={1000}
                                />
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Location ============================================= */}
                        {msg.message_type === "location" && (
                          <div className="h-52 w-full max-w-80 rounded-[9px] min-w-64 pt-1 bg-main-green">
                            <div className="mx-auto mt-1 h-40 w-[95%] max-w-80">
                              {(() => {
                                const [latitude, longitude] =
                                  msg.message_content.split(",").map(Number);

                                return (
                                  <GoogleMapReact
                                    bootstrapURLKeys={{
                                      key: "AIzaSyAMZ4GbRFYSevy7tMaiH5s0JmMBBXc0qBA",
                                    }}
                                    defaultCenter={{
                                      lat: latitude,
                                      lng: longitude,
                                    }}
                                    defaultZoom={13}
                                    draggable={false}
                                  >
                                    <MdLocationPin className="text-3xl text-dark" />
                                  </GoogleMapReact>
                                );
                              })()}
                            </div>
                            <div className="grid place-content-center">
                              {(() => {
                                const [latitude, longitude] =
                                  msg.message_content.split(",").map(Number);

                                return (
                                  <a
                                    target="_blank"
                                    href={`http://maps.google.com/maps?z=12&t=m&q=loc:${latitude}+${longitude}`}
                                    className="mt-3 w-full cursor-pointer font-medium text-primary"
                                  >
                                    View Location
                                  </a>
                                );
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Social Reel ======================================================================================= */}
                        {msg.message_type === "social" && (
                          <div
                            className={`relative w-48 h-full rounded-t-lg rounded-bl-lg overflow-hidden cursor-pointer p-1 ${
                              isMine ? "bg-main-green" : "bg-dark-gray"
                            }`}
                            onClick={() => {
                              dispatch(
                                setSelectedReel({
                                  ...msg.Social,
                                  User: msg.User,
                                  Media: [
                                    {
                                      media_location: messageContent, // video URL from message
                                    },
                                  ],
                                })
                              );

                              dispatch(
                                setActiveCommentPostId(msg.Social.social_id)
                              );
                              dispatch(setActiveUserId(msg.User.user_id));
                            }}
                          >
                            <div className="relative">
                              <Image
                                src={normalizeMediaUrl(msg.Social.reel_thumbnail)}
                                alt="reel"
                                className="w-full h-64 object-cover rounded-lg"
                                height={640}
                                width={640}
                              />
                              {/* Reel icon with curved corner */}
                              <div
                                className={`absolute bottom-0 ${
                                  isMine
                                    ? " rounded-full -bottom-1 -right-1 bg-main-green p-0.5"
                                    : "-left-1 p-0.5 -bottom-1 rounded-full bg-[#54505B]"
                                } `}
                              >
                                <Image
                                  src="/SidebarIcons/reel_icon.png" // use your reel icon path
                                  alt="Reel Icon"
                                  className="w-5 h-5 rounded-full pt-0.5 pr-0.5"
                                  width={100}
                                  height={100}
                                />
                              </div>
                            </div>

                            {/* User info ============================================================ */}
                            <div className="absolute top-2 left-2 flex gap-1 items-center">
                              <Image
                                src={normalizeMediaUrl(msg.User.profile_pic)}
                                alt="user"
                                className="w-6 h-6 rounded-full"
                                width={80}
                                height={80}
                              />
                              <p className="text-primary text-sm font-gilroy_semibold inline-block drop-shadow-[0_1px_2px_rgba(0,0,0,3)]">
                                {msg.User.user_name}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Gif ============================================================== */}
                        {msg.message_type === "gif" && (
                          <div>
                            <Image
                              className={`h-full w-[17rem] select-none rounded-lg object-cover transition-all duration-300`}
                              alt="gif"
                              src={messageContent}
                              width={300}
                              height={300}
                            />
                          </div>
                        )}

                        {/* time ============================================================= */}
                        <div
                          className={`flex place-items-center gap-1 ${
                            isMine ? "justify-end" : ""
                          }`}
                        >
                          <div
                            className={`text-[10px] text-gray-500 mt-1 ${
                              isMine ? "text-right" : "text-left"
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </div>

                          {isMine && (
                            <Image
                              src={
                                seenStatus[msg.message_id] === "seen" ||
                                msg.message_seen_status === "seen"
                                  ? "/chat/seenTick.png"
                                  : "/chat/unseenTick.png"
                              }
                              alt="seen"
                              width={14}
                              height={14}
                              className="w-4 h-2"
                            />
                          )}
                        </div>
                      </div>

                      {isMine && (
                        <Image
                          src={normalizeMediaUrl(msg.User?.profile_pic)}
                          width={20}
                          height={20}
                          className="rounded-full"
                          alt="avatar"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          // Empty conversation after loading is complete
          <div className="flex flex-col items-center justify-center text-gray-500 text-sm py-72">
            {/* <Image src="/home/Empty.png" height={60} width={60} alt="empty" /> */}
            <p className="text-dark text-sm flex gap-2 place-items-center">
              Start Conversation{" "}
              <MdWavingHand className="text-yellow-500 text-xl" />
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {isOpenImageFromChat && <OpenImageFromChat url={url} />}
      {isOpenVideoFromChat && <OpenVideoComponent url={url} />}
      <ReelDetailsModal setReels={function (value: React.SetStateAction<Reel[]>): void {
        // throw new Error("Function not implemented.");
      } } />
    </>
  );
}
