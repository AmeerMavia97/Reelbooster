"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

import Image from "next/image";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import DemoComments from "./DemoComments";
import LiveLikeUserModal from "./LiveLikeUserModal";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { socketInstance } from "../socket/socket";
import { useUserProfile } from "../store/api/updateUser";
import { ActivityOnLiveComment, ActivityOnLiveLike } from "../types/LiveReels";
import { addLike } from "../store/Slice/likeSlice";
import { addLiveEvent, clearCommentDraft, setCommentDraft } from "../store/Slice/LiveSlice";

const LiveLikeCommentLiveHostUser: React.FC = () => {
  const dispatch = useAppDispatch();
  const { liveEvents, commentDraft } = useAppSelector(
    (state) => state.live
  );


    const [open, setOpen] = useState(false);


  const IS_DEMO = process.env.NEXT_PUBLIC_IS_DEMO === "true";



  const socket_room_id = useAppSelector(
    (state) => state?.live?.lives[0]?.socket_room_id
  );

  const user_id = Number(Cookies.get("Reelboost_user_id"));
  const socket = socketInstance();
  const [hearts, setHearts] = useState<number[]>([]);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const token = Cookies.get("Reelboost_auth_token");
  const { data: userData } = useUserProfile(token ?? "");







  // 📌 Listen for activity_on_live updates
  useEffect(() => {


    socket.on("activity_on_live", (data: ActivityOnLiveComment | ActivityOnLiveLike) => {

      console.log("activity_on_live" , data)

   if (data.like === true && data.user_id !== user_id) {
   dispatch(
  addLike({
    user_id: data.user_id,
    user_name: data.user_name,
    first_name: data.first_name,
    last_name: data.last_name,
    profile_pic: data.profile_pic,
  })
);
    
   }


      console.log("datadatadatadatadata" , data)


      dispatch(addLiveEvent(data));
      if (data.like) {
        setHearts((prev) => [...prev, Date.now()]);
      }
    });
    return () => {
      socket.off("activity_on_live");
    };
  }, [socket, dispatch]);

  // 📌 Auto scroll to bottom (newest comment visible)
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveEvents]);

  // 📌 Auto-floating hearts every 3 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setHearts((prev) => [...prev, Date.now()]);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  // 📌 Send comment
  const handleSendComment = useCallback(() => {
    if (!commentDraft.trim() || !socket_room_id) return;
    socket.emit("activity_on_live", {
      socket_room_id,
      user_id,
      comment: commentDraft,
    });
    dispatch(clearCommentDraft());
  }, [commentDraft, socket_room_id, socket, dispatch, user_id]);

  // 📌 Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendComment();
    }
  };

const likeuserDetail = useAppSelector((state) => state.likes);

console.log("likeuserDetail#########" , likeuserDetail)

const firstUser = Object.values(likeuserDetail.users || {})[0];



  // 📌 Filter comments
  const comments = liveEvents.filter((event) => event.comment);



  //  when clikc on image then open modal 




  return (
   <>
   
    <div className="relative h-full   w-full">
      {/* Floating Hearts */}
      <div className="absolute right-10 bottom-20 pointer-events-none">
        {hearts.map((id) => (
          <motion.div
            key={id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              y: -150,
              x: Math.random() * 40 - 20,
              scale: 1.5,
            }}
            transition={{ duration: 2, ease: "easeOut" }}
            onAnimationComplete={() =>
              setHearts((prev) => prev.filter((h) => h !== id))
            }
            className="absolute text-primary text-lg"
          >
            ❤️
          </motion.div>
        ))}
      </div>

      {/* Comments section */}
     
     <div
  className="
    flex flex-col
    gap-2 sm:gap-3 md:gap-4
    p-2 sm:p-3 md:p-4
    overflow-y-auto
    h-full
    max-h-[25vh] sm:max-h-[55vh] md:max-h-[70vh] lg:max-h-[70vh]
  "
>
      { IS_DEMO && (
          <DemoComments />
      )}

        {comments.map((event, i) => {
          const faded = comments.length > 5 && i < 2;
          return (
            <div
              key={i}
              className={`flex  items-center gap-2 ${faded ? "opacity-50" : "opacity-100"}`}
            >
              <Image
                src={event.profile_pic}
                alt={event.user_name}
                width={28}
                height={28}
                className="rounded-full"
              />
              <div className="flex flex-col text-primary">
                <span className="text-sm font-semibold drop-shadow-md">{event.user_name}</span>
                <span className="text-xs text-primary drop-shadow-md">{event.comment_cotent}</span>
              </div>
            </div>
          );
        })}
        <div ref={commentsEndRef} />
      </div>

      {/* Input + Like */}
      <div className="flex items-center gap-2 rounded-b-lg rounded-t-3xl p-2 backdrop-blur-lg">
        {/* User profile pic */}
        <Image
          src={userData?.data.profile_pic || ""}
          alt=""
          width={25}
          height={25}
          className="w-8 h-8 object-cover"
        />
        <div className="bg-primary/[0.4] w-full flex items-center rounded-full relative">
          <input
            type="text"
            value={commentDraft}
            onChange={(e) => dispatch(setCommentDraft(e.target.value))}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment..."
            className="flex-1 text-black text-sm p-2.5 outline-none rounded-full"
          />
          <button
            className="text-primary w-8 h-8 flex justify-center items-center rounded-full text-lg hover:scale-110 absolute right-2 transition"
            style={{ background: "linear-gradient(141.72deg, #239C57 -1.01%, #019FC8 103.86%)" }}
            onClick={handleSendComment}
          >
            <Image src="/chat/send.png" alt="send" width={60} height={60} className="w-5 h-5" />
          </button>
        </div>

      
 {!firstUser?.profile_pic && (
         <button
    onClick={() => setOpen(true)}
    className="text-primary cursor-pointer text-2xl transition"
  >
    <img
      src="./demo/Frame.svg"
      alt="liked user"
      className="w-12 h-10 rounded-full object-cover"
    />
  </button>

 )}
      
 {firstUser?.profile_pic && (
  <button
    onClick={() => setOpen(true)}
    className="text-primary cursor-pointer text-2xl transition"
  >
    <img
      src={firstUser.profile_pic }
      alt="liked user"
      className="w-12 h-10 rounded-full object-cover"
    />
  </button>
)}




      </div>
    </div>

          {open && (
        <LiveLikeUserModal
          open={open}
          onClose={() => setOpen(false)}
        />
      )}

   </>
  );
};

export default LiveLikeCommentLiveHostUser;
