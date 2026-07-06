"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import generateVideoThumbnail from "../utils/generateVideoThumbnail";
import { updateSendMessageData } from "../store/Slice/SendMessageSlice";
import { updateMessageOptions } from "../store/Slice/MessageOptionsSlice";
import { useAppDispatch } from "../utils/hooks";

type Props = {
  setMediaFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setMediaType: React.Dispatch<
    React.SetStateAction<"chat_image" | "chat_video" | "doc" | null>
  >;
  setMessageType: React.Dispatch<
    React.SetStateAction<"image" | "video" | "doc" | null>
  >;
  setThumbnail: React.Dispatch<React.SetStateAction<string | null>>;
};

const MediaUploadInput: React.FC<Props> = ({
  setMediaFiles,
  setMediaType,
  setThumbnail,
  setMessageType,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null); // 📌 New ref

  const handleMediaClick = () => {
    setShowOptions((prev) => !prev);
  };
  const dispatch = useAppDispatch();

  const handleFileSelect = (
    accept: string,
    type: "chat_image" | "chat_video" | "doc"
  ) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.dataset.type = type;
      fileInputRef.current.click();
    }
    setShowOptions(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = fileInputRef.current?.dataset.type as
      | "chat_image"
      | "chat_video"
      | "doc";
    setMediaType(fileType);
    setMediaFiles([file]);

    // ✅ Set MessageType based on fileType
    if (fileType === "chat_image") {
      setMessageType("image");
    } else if (fileType === "chat_video") {
      setMessageType("video");
      const thumb = await generateVideoThumbnail(file);
      setThumbnail(thumb);
    } else {
      setMessageType("doc");
    }
  };

    // 🔒 Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <button className="cursor-pointer" onClick={handleMediaClick}>
        <Image
          src="/home/sendMedia.png"
          alt="Send Media"
          width={20}
          height={20}
        />
      </button>

      {showOptions && (
        <div ref={menuRef} className="absolute bottom-6 flex mb-2 p-2 right-0 bg-primary border rounded-md shadow-lg z-50 w-[360px]">
          <button
            onClick={() => handleFileSelect("image/*", "chat_image")}
            className="p-2 flex flex-col gap-2 place-items-center"
          >
            <Image src="/chat/Photo.png" alt="photo" width={50} height={50} />
            <span className="text-dark text-xs">Image</span>
          </button>
          <button
            onClick={() => handleFileSelect("video/*", "chat_video")}
            className="p-2 flex flex-col gap-2 place-items-center"
          >
            <Image src="/chat/Video.png" alt="video" width={50} height={50} />
            <span className="text-dark text-xs">Video</span>
          </button>
          <button
            onClick={() => handleFileSelect(".pdf", "doc")}
            className="p-2 flex flex-col gap-2 place-items-center"
          >
            <Image src="/chat/Document.png" alt="doc" width={50} height={50} />
            <span className="text-dark text-xs">Document</span>
          </button>
          <button
            className="p-2 flex flex-col gap-2 place-items-center"
            onClick={() => {
              dispatch(
                updateSendMessageData({
                  message_type: "location",
                })
              );
              dispatch(
                updateMessageOptions({
                  show_send_location_modal: true,
                })
              );

              close(); // Close the menu when clicked
            }}
          >
            <Image src="/chat/Location.png" alt="doc" width={50} height={50} />
            <span className="text-dark text-xs">Location</span>
          </button>
          <button
            onClick={() => {
              dispatch(
                updateSendMessageData({
                  message_type: "location",
                })
              );
              dispatch(
                updateSendMessageData({
                  message_type: "gif",
                  showGifPicker: true,
                  // chat_id:
                  //   CurrentConversationData.conversation_id,
                })
              );
              close(); // Close the menu when clicked
            }}
            className="p-2 flex flex-col gap-2 place-items-center"
          >
            <Image src="/chat/Gif.png" alt="doc" width={50} height={50} />
            <span className="text-dark text-xs">Gif</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaUploadInput;
