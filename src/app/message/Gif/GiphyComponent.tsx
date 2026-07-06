import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "@/app/utils/hooks";
import { updateSendMessageData } from "@/app/store/Slice/SendMessageSlice";
import { IoSearchOutline } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { appendMessageWithDateCheck } from "@/app/store/Slice/MessageListSlice";
import { socketInstance } from "@/app/socket/socket";
import { updateCurrentConversation } from "@/app/store/Slice/CurrentConversationSlice";
import useApiPost from "@/app/hooks/postData";
import Cookies from "js-cookie";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { useUserProfile } from "@/app/store/api/updateUser";

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIF_API_KEY;
interface GifImage {
  url: string;
  width: string;
  height: string;
  mp4?: string;
  mp4_size?: string;
}

interface GifImages {
  original: GifImage;
  fixed_height: GifImage;
  [key: string]: GifImage; // for other sizes
}

interface Gif {
  id: string;
  title: string;
  images: GifImages;
}


export default function GiphyComponent() {
  const dispatch = useAppDispatch();
  const SendMessageData = useAppSelector((state) => state.SendMessageData);
  const sendMessageDataRef = useRef(SendMessageData);
  const [searchTerm, setSearchTerm] = useState("");
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGif, setSelectedGif] = useState<Gif | null>(null); 
  const myUserId = Cookies.get("Reelboost_user_id");

  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation
  );
  const { postData } = useApiPost();
  const token = Cookies.get("Reelboost_auth_token");
  const { data: userData } = useUserProfile(token ?? "");

  useEffect(() => {
    sendMessageDataRef.current = SendMessageData;
  }, [SendMessageData]);

  // Fetch GIFs
  const fetchGifs = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(endpoint);
      setGifs(res.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchGifs(
      `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=18`
    );
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchGifs(
        `https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${GIPHY_API_KEY}&limit=18`
      );
    }
  }, [searchTerm]);

  const sendSelectedGif = async () => {
    if (!selectedGif) return;
    try {
      const response = await fetch(selectedGif.images.original.url);
      const blob = await response.blob();
      const file = new File([blob], "giphy.gif", { type: "image/gif" });

      const tempMessage = {
        message_id: Date.now(),
        message_type: "gif",
        message_content: selectedGif.images.original.url,
        message_thumbnail: selectedGif.images.original.url,
        sender_id: parseInt(myUserId || "0"),
        createdAt: new Date().toISOString(),
        User: {
          profile_pic: userData?.data?.profile_pic || "",
          user_name: userData?.data?.user_name || "",
        },
      };

      // dispatch(prependMessageList([tempMessage]));

      const formData = new FormData();
      formData.append("message_type", "gif");
      const userId = currentConversationData?.PeerUserData?.user_id;
      if (userId) {
        formData.append("user_id", String(userId));
      }
      formData.append("files", file);
      formData.append("message_content", "");

      const sendMessageRes = await postData(
        "/chat/send-message",
        formData,
        "multipart/form-data"
      );
      dispatch(updateSendMessageData({ showGifPicker: false }));

      if (sendMessageRes) {
        if (
          currentConversationData.chat_id === 0 ||
          currentConversationData.chat_id === -1
        ) {
          dispatch(
            updateCurrentConversation({ chat_id: sendMessageRes.chat_id })
          );
        }

        dispatch(appendMessageWithDateCheck(sendMessageRes));
        dispatch(
          updateSendMessageData({ message: "", message_type: "", reply_id: 0 })
        );

        socketInstance().emit("chat_list", {});
      }

      setSelectedGif(null);
    } catch (error) {
    }
  };

  return (
    <div className={`z-10 w-full max-w-xl bg-pr transition duration-500`}>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Send GIFs</h2>
        <div className="relative mb-6 mt-3">
          <IoSearchOutline className="absolute left-3 top-2 text-2xl text-lightText" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`bg-[#F2F2F2] w-full rounded-xl border border-borderColor py-2 pl-11 placeholder-lightText outline-none`}
            type="text"
            placeholder="Search Gif"
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {loading ? (
          <div className="grid h-96 place-content-center">
            <ClipLoader size={19} color={"black"} />
          </div>
        ) : (
          <div className="grid max-h-[30rem] min-h-96 grid-cols-3 gap-3 overflow-auto">
            {gifs.map((gif: Gif) => {
              const isSelected = selectedGif?.id === gif.id;
              return (
                <div
                  key={gif.id}
                  className="relative cursor-pointer"
                  onClick={() => setSelectedGif(isSelected ? null : gif)}
                >
                  <Image
                    src={gif.images.fixed_height.url}
                    alt={gif.title}
                    className="h-full w-full rounded-lg object-cover"
                    width={150}
                    height={150}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-dark/40 flex items-center justify-center rounded-lg">
                      <FaCheckCircle className="text-primary text-3xl" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Send Button */}
        <div className="flex justify-center items-center">
          <button
            onClick={sendSelectedGif}
            disabled={!selectedGif}
            className={`mt-4 flex items-center justify-center gap-2 px-24 py-2 rounded-xl text-primary ${
              selectedGif ? "bg-main-green" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Send
            {/* <IoSend /> */}
          </button>
        </div>
      </div>
    </div>
  );
}
