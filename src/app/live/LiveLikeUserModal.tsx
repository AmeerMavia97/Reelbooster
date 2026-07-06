"use client";
import React, { useMemo } from "react";
import { FaHeart } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import Image from "next/image";
import { useAppSelector } from "../utils/hooks";

/* ================= TYPES ================= */
interface LiveLikeUserModalProps {
  open?: boolean;
  onClose?: () => void;
}

interface LikeUser {
  user_id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  profile_pic?: string;
  likeCount?: number;
}

/* ================= COMPONENT ================= */
const LiveLikeUserModal: React.FC<LiveLikeUserModalProps> = ({
  open = false,
  onClose,
}) => {
  const { users: usersMap = {}, totalLikes = 0 } =
    useAppSelector((state) => state.likes) || {};


    console.log("LiveLikeUserModal usersMap:", usersMap);

  const users = useMemo<LikeUser[]>(
    () => Object.values(usersMap),
    [usersMap]
  );

  if (!open) return null;

  return (
    <>
      {/* ===== Overlay ===== */}
    {/* ===== Overlay ===== */}
<div
  className="fixed inset-0 z-40 "
  onClick={onClose}
/>

{/* ===== Modal ===== */}
<div
  className="
    fixed z-50
    left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
    bg-black text-white
    w-[92%] sm:w-[380px]
    max-h-[80vh]
    rounded-xl overflow-hidden
    shadow-2xl

    md:left-auto md:right-6
    md:top-auto md:bottom-[4rem]
    md:-translate-x-0 md:-translate-y-0
  "
>

  {/* ===== Header ===== */}
  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
    <div className="flex items-center gap-2">
      <FaHeart className="text-red-500" />
      <p className="font-semibold text-sm">
        Likes ({totalLikes})
      </p>
    </div>

    <button onClick={onClose}>
      <IoCloseCircleOutline size={22} />
    </button>
  </div>

  {/* ===== Body ===== */}
  <div className="max-h-[65vh] overflow-y-auto">
    {users.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-6">
        <Image
          src="/profile/NoLiked.png"
          alt="No Likes"
          width={60}
          height={60}
        />
        <p className="text-xs text-white mt-2">
          No Likes Yet.
        </p>
      </div>
    ) : (
      users.map((user, index) => (
        <div key={user.user_id}>
          <div className="flex items-center gap-3 px-4 py-3">
            <img
              src={user.profile_pic || "/avatar.jpg"}
              alt="user"
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-white/60 truncate">
                @{user.user_name}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs text-white/60">
                {user.likeCount ?? 1}
              </span>
              <FaHeart className="text-red-500 text-xs" />
            </div>
          </div>

          {index < users.length - 1 && (
            <div className="border-b border-white/10 mx-4" />
          )}
        </div>
      ))
    )}
  </div>
</div>

    </>
  );
};

export default LiveLikeUserModal;
