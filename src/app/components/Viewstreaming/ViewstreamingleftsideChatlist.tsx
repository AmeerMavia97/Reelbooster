"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import { socketInstance, addSocketListenerOnce } from "@/app/socket/socket";
import { useUserProfile } from "@/app/store/api/updateUser";
import {
  addLiveEvent,
  clearCommentDraft,
  setCommentDraft,
} from "@/app/store/Slice/LiveSlice";

const IS_DEMO = process.env.NEXT_PUBLIC_IS_DEMO === "true";

/* =======================
   DEMO COMMENTS (QUEUE)
======================= */
const DEMO_COMMENTS = [
  { user_name: "Sophia", profile_pic: "/demo/sophia_profile_photo.jpg", comment_cotent: "Hello!!", isDemo: true, id: "d1" },
  { user_name: "Olivia", profile_pic: "/demo/emily_profile_photo.jpg", comment_cotent: "Hello, I am here!!", isDemo: true, id: "d2" },
  { user_name: "Amelia", profile_pic: "/demo/amelia_profile_photo.jpg", comment_cotent: "Is this a giveaway live?", isDemo: true, id: "d3" },
  { user_name: "Isla", profile_pic: "/demo/isla_profile_photo.jpg", comment_cotent: "I am excited for this giveaway!", isDemo: true, id: "d4" },
  { user_name: "Jack", profile_pic: "/demo/jack_profile_photo.jpg", comment_cotent: "When is next collaboration?", isDemo: true, id: "d5" },
  { user_name: "Mia", profile_pic: "/demo/mia_profile_photo.jpg", comment_cotent: "This live is so good!!", isDemo: true, id: "d6" },
  { user_name: "Emily", profile_pic: "/demo/emily_profile_photo.jpg", comment_cotent: "When will you announce the winner?", isDemo: true, id: "d7" },
  { user_name: "Harry", profile_pic: "/demo/harry_profile_photo.jpg", comment_cotent: "Waiting to start!", isDemo: true, id: "d8" },
];

const ViewstreamingleftsideChatlist = () => {
  const dispatch = useAppDispatch();
  const socket = socketInstance();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [hearts, setHearts] = useState<number[]>([]);
  const [demoComments, setDemoComments] = useState<any[]>([]);
  const [demoIndex, setDemoIndex] = useState(0);

  /* =======================
     REDUX
  ======================= */
  const liveRecords = useAppSelector((state) => state.viewStream.records[0]);
  const { liveEvents, commentDraft } = useAppSelector((state) => state.live);

  /* =======================
     USER DATA
  ======================= */
  const token = Cookies.get("Reelboost_auth_token");
  const { data: userData } = useUserProfile(token ?? "");

  /* =======================
     DERIVED VALUES
  ======================= */
  const socketRoomId = liveRecords?.Live.socket_room_id ?? null;

  const userId = useMemo(() => userData?.data?.user_id ?? null, [userData]);

  /* =======================
     DEMO COMMENTS (ONE BY ONE)
  ======================= */
  useEffect(() => {
    if (!IS_DEMO || demoIndex >= DEMO_COMMENTS.length) return;

    const timer = setTimeout(() => {
      setDemoComments((prev) => [...prev, DEMO_COMMENTS[demoIndex]]);
      setDemoIndex((prev) => prev + 1);
    }, demoIndex === 0 ? 0 : 4000);

    return () => clearTimeout(timer);
  }, [demoIndex]);

  /* =======================
     SOCKET LISTENER (GLOBAL, SINGLE)
  ======================= */
  useEffect(() => {
    const handleActivity = (data: any) => {
      console.log("Received activity_on_live data:", data);

      // Add heart if like
      if (data.like) setHearts((prev) => [...prev, Date.now()]);

      // Add comment event to Redux
      if (data.comment) dispatch(addLiveEvent(data));
    };

    addSocketListenerOnce("activity_on_live", handleActivity);
  }, [dispatch]);

  /* =======================
     AUTO SCROLL
  ======================= */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [demoComments, liveEvents]);

  /* =======================
     SEND COMMENT
  ======================= */
  const handleSendComment = () => {


    if (!commentDraft.trim() || !socketRoomId || !userId) return;

    socket.emit("activity_on_live", {
      socket_room_id: socketRoomId,
      user_id: userId,
      comment: commentDraft,
    });

    dispatch(clearCommentDraft());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendComment();
    }
  };

  /* =======================
     SEND LIKE
  ======================= */
  const handleSendLike = () => {
    if (!socketRoomId || !userId) return;

    socket.emit("activity_on_live", {
      socket_room_id: socketRoomId,
      user_id: userId,
      like: true,
    });

    setHearts((prev) => [...prev, Date.now()]);
  };

  /* =======================
     MERGED COMMENTS
  ======================= */
  const mergedComments = useMemo(() => {
    const realComments = liveEvents.filter((e) => e.comment);

    if (!IS_DEMO) return [...realComments].reverse();

    return [...demoComments, ...realComments].reverse();
  }, [demoComments, liveEvents]);

  return (
    <div className="relative w-full h-full flex flex-col pt-[7rem]">
      {/* FLOATING HEARTS */}
      <div className="absolute right-14 bottom-24 pointer-events-none">
        {hearts.map((id) => (
          <motion.div
            key={id}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -150 }}
            transition={{ duration: 2 }}
            onAnimationComplete={() =>
              setHearts((prev) => prev.filter((h) => h !== id))
            }
            className="absolute text-red-500 text-lg"
          >
            ❤️
          </motion.div>
        ))}
      </div>

      {/* CHAT LIST */}
      <div
        ref={scrollRef}
        className="flex-1 flex flex-col-reverse overflow-y-auto px-6 py-8 mb-[3.5rem] gap-3"
      >
        {mergedComments.map((c, i) => (
          <div key={c.id ?? i} className="flex items-start gap-3">
            <Image
              src={c.profile_pic || "/default-profile.png"}
              alt={c.user_name || "User"}
              width={40}
              height={40}
              className="rounded-full h-10 w-10"
            />
            <div className="flex flex-col max-w-[65%] text-white">
              <span className="text-xs text-gray-300 truncate">{c.user_name}</span>
              <span className="text-xs sm:text-sm break-words">{c.comment_cotent}</span>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT BAR */}
      <div className="flex items-center gap-2 p-2 rounded-full bg-gray-800/80 mx-auto w-[97%] absolute bottom-3">
        <Image
          src={userData?.data?.profile_pic || "/default-profile.png"}
          alt="profile"
          width={32}
          height={32}
          className="rounded-full h-9  w-9"
        />

        <div className="flex-1 relative">
          <input
            type="text"
            value={commentDraft}
            onChange={(e) => dispatch(setCommentDraft(e.target.value))}
            onKeyDown={handleKeyDown}
            placeholder="Say something..."
            className="w-full p-2 rounded-full bg-transparent text-white text-sm outline-none"
          />
          <button
            onClick={handleSendComment}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(141.72deg, #239C57 -1%, #019FC8 104%)",
            }}
          >
            <Image src="/chat/send.png" alt="send" width={20} height={20} />
          </button>
        </div>

        <button onClick={handleSendLike}>
          <Image src="/ReelBoost/borderHeart.png" alt="like" width={32} height={26} />
        </button>
      </div>
    </div>
  );
};

export default ViewstreamingleftsideChatlist;
