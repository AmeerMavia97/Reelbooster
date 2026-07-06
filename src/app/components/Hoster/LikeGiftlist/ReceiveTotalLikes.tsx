"use client";

import React, { memo, useMemo } from "react";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { useAppSelector } from "@/app/utils/hooks";

/* ================= TYPES ================= */

interface LikeUser {
  user_id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  profile_pic?: string;
  likeCount?: number;
}

/* ================= USER ITEM ================= */

const UserItem = memo(({ user }: { user: LikeUser }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 w-full hover:bg-white/5 transition">
      <div>
        <Image
        src={user.profile_pic || "/avatar.jpg"}
        alt={`${user.first_name} ${user.last_name}`}
        width={50}
        height={60}
        className="rounded-full w-10 h-10 object-cover"
      />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-xs text-white/60 truncate">
          @{user.user_name}
        </p>
      </div>

      <div className="flex items-center gap-1 text-xs">
        <span className="text-white/60">
          {user.likeCount ?? 1}
        </span>
        <FaHeart className="text-red-500" />
      </div>
    </div>
  );
});

UserItem.displayName = "UserItem";

/* ================= MAIN COMPONENT ================= */

const ReceiveTotalLikes: React.FC = () => {
  const usersMap = useAppSelector(
    (state) => state.likes?.users
  );

  const users = useMemo<LikeUser[]>(() => {
    if (!usersMap) return [];
    return Object.values(usersMap);
  }, [usersMap]);

  if (!users.length) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-8">
        <Image
          src="/profile/NoLiked.png"
          alt="No Likes"
          width={70}
          height={70}
          className="opacity-80"
        />
        <p className="text-xs text-white/60 mt-3">
          No Likes Yet
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      {users.map((user, index) => (
        <div key={user.user_id}>
          <UserItem user={user} />
          {index !== users.length - 1 && (
            <div className="border-b border-white/10 mx-4" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ReceiveTotalLikes;
