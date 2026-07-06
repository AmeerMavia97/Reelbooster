"use client";
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import { socketInstance } from "../socket/socket";
import useApiPost from "../hooks/postData";
import Image from "next/image";
import MediaUploadInput from "./MediaUploadInput";
import EmojiPickerComponent from "./EmojiPickerComponent";
import { ClipLoader } from "react-spinners";
import { ProjectConfigRes } from "../types/ResTypes";
import Cookies from "js-cookie";

function SendMessageInput() {
  const dispatch = useAppDispatch();
  const { postData } = useApiPost();
  const currentConversation = useAppSelector(
    (state) => state.CurrentConversation
  );
  const PeerUserData = currentConversation?.PeerUserData;
  const token = Cookies.get("Reelboost_auth_token");

  const chat_id = currentConversation?.chat_id;
  const isNewConversation = currentConversation?.isNewConversation || false;

  const [text, setText] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaflow, setMediaflow] = useState<"LOCAL" | "S3" | string>("");
  const [mediaType, setMediaType] = useState<
    "chat_image" | "chat_video" | "doc" | null
  >(null);
  const [MessageType, setMessageType] = useState<
    "image" | "video" | "doc" | null
  >(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchConfig = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/project_conf`
        );
        const data: ProjectConfigRes = await res.json();
        if (data?.data?.mediaflow) setMediaflow(data.data.mediaflow);
      } catch (error) {}
    };
    fetchConfig();
  }, [token]);

  const clearInput = () => {
    setText("");
    setMediaFiles([]);
    setThumbnail(null);
    setMediaType(null);
    setMessageType(null);
  };

  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (isSending) return; // 🚫 Block duplicate clicks
    if (!text.trim() && mediaFiles.length === 0) return;

    setIsSending(true); // 🔒 Lock sending

    const socket = socketInstance();

    try {
      if (mediaFiles.length > 0) {
        const formData = new FormData();

        if (isNewConversation) {
          formData.append(
            "user_id",
            String(currentConversation?.PeerUserData?.user_id ?? "")
          );
          formData.append("chat_type", "private");
        } else {
          formData.append("chat_id", String(chat_id));
        }

        const pictureType = mediaType || "doc";
        const messageType = MessageType || "doc";

        formData.append("message_type", messageType);
        formData.append("pictureType", pictureType);
        formData.append("message_content", "");

        if (mediaType === "chat_video" && thumbnail) {
          const blob = await fetch(thumbnail).then((res) => res.blob());
          const thumbFile = new File([blob], "thumbnail.png", {
            type: "image/png",
          });
          if(mediaflow === "LOCAL") {
formData.append("files", thumbFile);
          formData.append("files", mediaFiles[0]);
          } else {
            formData.append("file_media_1",thumbFile)
            formData.append("file_media_1",mediaFiles[0])
          }
          
          // formData.append
        } else {
          if (mediaflow == "LOCAL") {
            mediaFiles.forEach((file) => {
              formData.append("files", file);
            });
          } else {
            mediaFiles.forEach((file) => {
              formData.append("file_media_1", file);
            });
          }
        }

        await postData("/chat/send-message", formData, "multipart/form-data");
      }

      if (text.trim()) {
        const payload: Record<string, unknown> = {
          message_type: "text",
          message_content: text,
        };

        if (isNewConversation) {
          payload.user_id = currentConversation?.PeerUserData?.user_id;
          payload.chat_type = "private";
        } else {
          payload.chat_id = chat_id;
        }

        await postData("/chat/send-message", payload);
        socket.emit("chat_list", { page: 1, pageSize: 1000 });
      }

      clearInput();
    } catch (error) {
    } finally {
      setIsSending(false); // 🔓 Unlock sending
    }
  };

  // for update of typing states =======================
  const handleTyping = () => {
    const socket = socketInstance();
    if (socket && chat_id) {
      const payload = { chat_id, typing: true };

      // emit event to backend
      socket.emit("typing", payload);

      // update Redux state locally
      // dispatch(updateTypingState(payload));
    }
  };

  // to false typing state =============
  useEffect(() => {
    const socket = socketInstance();
    if (!socket || !chat_id) return;

    const timeout = setTimeout(() => {
      const payload = { chat_id, typing: false };

      socket.emit("typing", payload); // send to server
      // dispatch(updateTypingState(payload)); // update Redux
    }, 500);

    return () => clearTimeout(timeout);
  }, [text, chat_id, dispatch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (text.trim() || mediaFiles.length > 0) {
        handleSend(); // ✅ Will send media or text
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  return (
    <>
      {PeerUserData && (
        <div className="relative border-[#B0B0B0] px-4 py-3">
          {/* Media Preview */}
          {mediaFiles.length > 0 && (
            <div className="w-full overflow-x-auto mb-3">
              <div className="flex gap-3 w-max">
                {mediaFiles.map((file, idx) => {
                  const isImage = file.type.startsWith("image/");
                  const isVideo = file.type.startsWith("video/");
                  // const isDoc = !isImage && !isVideo;

                  return (
                    <div key={idx} className="relative">
                      {/* Preview */}
                      {isImage || isVideo ? (
                        <div className="relative w-52 h-40 p-2 rounded-lg bg-main-green/[0.2] overflow-hidden flex items-center justify-center">
                          {isImage ? (
                            <Image
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              className="object-cover w-full h-full"
                              width={160}
                              height={100}
                            />
                          ) : (
                            <video
                              src={URL.createObjectURL(file)}
                              className="w-full h-full object-cover"
                              autoPlay
                              muted
                              loop
                            />
                          )}
                        </div>
                      ) : (
                        <div className="w-full max-w-96 rounded-[9px]">
                          <div className="flex items-center justify-between gap-2 rounded-[7px] p-4 px-6 text-sm background-opacityGradient">
                            <div className="flex items-center gap-2">
                              <Image
                                className="h-10 w-10 object-cover"
                                src="/chat/pdf_icons.png"
                                alt=""
                                width={100}
                                height={100}
                              />
                              <div className="w-full text-dark line-clamp-2 max-w-60 text-xs overflow-hidden">
                                {file.name
                                  ?.split("/")
                                  .pop()
                                  ?.split("-")
                                  .slice(1)
                                  .join("-") || ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Remove button - works for ALL file types */}
                      <button
                        onClick={() =>
                          setMediaFiles((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
                        className="absolute -top-1 -right-1 bg-primary text-dark rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex w-full gap-3">
            <div className="flex w-full items-center gap-2 border border-[#B0B0B0] rounded-lg px-2 py-1">
              <EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />

              <input
                type="text"
                placeholder="Type Message"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  handleTyping();
                }}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className="flex-1 px-3 py-2 text-sm focus:outline-none text-dark placeholder:text-gray bg-transparent"
              />

              <MediaUploadInput
                setMediaFiles={setMediaFiles}
                setMediaType={setMediaType}
                setThumbnail={setThumbnail}
                setMessageType={setMessageType}
              />
            </div>

            <button
              className="px-4 py-2 text-sm text-primary rounded-xl bg-main-green"
              onClick={handleSend}
            >
              {isSending ? (
                <>
                  <ClipLoader color="#FFFFFF" size={15} loading={isSending} />
                </>
              ) : (
                <>
                  <Image
                    src="/chat/send.png"
                    width={25}
                    height={25}
                    alt="send"
                  />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SendMessageInput;