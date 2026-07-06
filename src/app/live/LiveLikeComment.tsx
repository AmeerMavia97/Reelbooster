"use client";
import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

import { toast } from "react-toastify";
import DemoComments from "./DemoComments";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { socketInstance } from "../socket/socket";
import { useUserProfile } from "../store/api/updateUser";
import useApiPost from "../hooks/postData";
import { ActivityOnLiveComment, ActivityOnLiveLike } from "../types/LiveReels";
import { addLiveEvent, clearCommentDraft, setCommentDraft } from "../store/Slice/LiveSlice";
import { SendGiftRes } from "../types/Gift";
import { showModal } from "../store/Slice/ModalsSlice";

function LiveLikeComment() {
  const dispatch = useAppDispatch();
  const { liveEvents, commentDraft, user_id, socket_room_id } = useAppSelector(
    (state) => state.live
  );


const IS_DEMO = process.env.NEXT_PUBLIC_IS_DEMO === "true";



  const socket = socketInstance();
  const [hearts, setHearts] = useState<number[]>([]);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const token = Cookies.get("Reelboost_auth_token");
   const { selectedGiftId ,quantity } =
      useAppSelector((state) => state.gift);
  
    const { data: userData } = useUserProfile(token ?? "");
    const {postData} = useApiPost();



  

  // 📌 Listen for activity_on_live updates
  useEffect(() => {

  

    socket.on(
      "activity_on_live",
      (data: ActivityOnLiveComment | ActivityOnLiveLike) => {
        dispatch(addLiveEvent(data));
        if (data.like) {
          setHearts((prev) => [...prev, Date.now()]);
        }
      }
    );
    return () => {
      socket.off("activity_on_live");
    };
  }, [socket, dispatch]);

  // 📌 Auto scroll to bottom (newest comment visible)
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveEvents]);

  
  // Auto-floating hearts every 3 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setHearts((prev) => [...prev, Date.now()]);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  // 📌 Send comment
  const handleSendComment = () => {
    if (!commentDraft.trim() || !socket_room_id) return;
    socket.emit("activity_on_live", {
      socket_room_id,
      user_id,
      comment: commentDraft,
    });
    dispatch(clearCommentDraft());
  };

  // 📌 Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendComment();
    }
  };

  // 📌 Send like
  const handleSendLike = () => {
    if (!socket_room_id) return;
    socket.emit("activity_on_live", {
      socket_room_id,
      user_id,
      like: true,
    });
    setHearts((prev) => [...prev, Date.now()]);
  };

  // 📌 All comments
  const comments = liveEvents.filter((event) => event.comment);

  // send gift ==============
  const handleGiftSend = async() => {
    dispatch(showModal("SendGift"))
    try {
      const res:SendGiftRes = await postData("/transaction/send-gift",{
        reciever_id: user_id,
        gift_id: selectedGiftId,
        transaction_ref:"live",
        quatity: quantity,
      })
      // if(res.status) {
      //   toast.success(res.message)
      // } else {
      //   toast.error(res.message)
      // }
    } catch(error) {

    }
  }



  const UserLiver = useAppSelector((state)=> state.modals.GoToliveModal)


  console.log("UserLiver" , UserLiver)



  const openModal = sessionStorage.getItem("openModal")


  console.log("openModalsessionvalues" , openModal)



  return (
    <div className="relative   w-full">
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
      <div   className="
    flex flex-col
    gap-2 sm:gap-3 md:gap-4
    p-2 sm:p-3 md:p-4
    overflow-y-auto
    h-full
    max-h-[30vh] sm:max-h-[55vh] md:max-h-[70vh] lg:max-h-[70vh]
  ">


      { IS_DEMO && (
          <DemoComments />
      )}


        {comments.map((event, i) => {
          const faded = comments.length > 5 && i < 2; // fade first 2 only if total > 5
          return (
            <div
              key={i}
              className={`flex items-center gap-2 ${
                faded ? "" : "opacity-100"
              }`}
            >
              <Image
                src={event.profile_pic}
                alt={event.user_name}
                width={28}
                height={28}
                className="rounded-full"
              />
              <div className="flex flex-col text-primary">
                <span className="text-sm font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,3)]">
                  {event.user_name}
                </span>
                <span className="text-xs text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,3)]">
                  {event.comment_cotent}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={commentsEndRef} />
      </div>

      {/* Input + Like */}
      <div
        className="flex items-center gap-2 rounded-b-lg rounded-t-3xl p-2"
        style={{ backdropFilter: "blur(18px)" }}
      >
        {/* my profile pic */}
        <Image
          src={userData?.data.profile_pic || ""}
          alt=""
          width={25}
          height={25}
          className="w-8 h-8 object-cover"
        />
        <div className="bg-primary/[0.4] w-full flex place-items-center rounded-full relative">
          <input
            type="text"
            value={commentDraft}
            onChange={(e) => dispatch(setCommentDraft(e.target.value))}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment..."
            className="flex-1 text-black text-sm p-2.5 outline-none rounded-full"
          />
          <button
            className="text-primary w-8 h-8 flex justify-center place-items-center rounded-full text-lg hover:scale-110 absolute right-2 transition"
            style={{background:"linear-gradient(141.72deg, #239C57 -1.01%, #019FC8 103.86%)"}}
            onClick={handleSendComment}
          >
            <Image src={"/chat/send.png"} alt="send" width={60} height={60} className="w-5 h-5"/>
          </button>
        </div>
        <button className="text-primary text-2xl transition cursor-pointer" onClick={() => handleGiftSend()}>
          <Image
            src="/home/gift.png"
            alt="heart"
            width={100}
            height={100}
            className="w-8 h-7"
          />
        </button>

        <button
          className="text-primary text-2xl transition"
          onClick={handleSendLike}
        >
          <Image
            src="/ReelBoost/borderHeart.png"
            alt="heart"
            width={100}
            height={100}
            className="w-8 h-6.5"
          />
        </button>
      </div>
    </div>
  );
}

export default LiveLikeComment;
    