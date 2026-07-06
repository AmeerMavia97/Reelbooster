"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";

import CoinsIcon from "../../../../../public/gift/coin-removebg-preview.png";
import { useAppSelector } from "@/app/utils/hooks";

const TotalGiftAndTotalCoins: React.FC = () => {
  /* -------------------- Redux Selectors -------------------- */
  const usersMap = useAppSelector((state) => state.likes?.users || {});
  const gifts = useAppSelector((state) => state.gifts?.gifts || []);

  /* -------------------- Derived Values -------------------- */
  const totalLikes = useMemo(() => {
    return Object.values(usersMap).reduce(
      (sum: number, user: any) => sum + (user?.likeCount || 0),
      0
    );
  }, [usersMap]);

  const totalReceivedCoins = gifts.length;

  /* -------------------- UI -------------------- */
  return (
    <div className="absolute bottom-1 left-3 right-3 z-50">
      <div className="flex items-center justify-between bg-black/70 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-2xl">

       

        {/* Total Received Coins */}
        <StatButton
          icon={
            <Image
              src={CoinsIcon}
              width={26}
              height={26}
              alt="Coins"
              className="object-contain"
            />
          }
          label="Total Received Coins"
          value={totalReceivedCoins}
        />

         {/* Total Received Likes */}
        <StatButton
          icon={<FaHeart className="text-red-500" />}
          label="Total Received Likes"
          value={totalLikes}
        />
      </div>
    </div>
  );
};

export default TotalGiftAndTotalCoins;

/* -------------------- Reusable Component -------------------- */

interface StatButtonProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

const StatButton: React.FC<StatButtonProps> = ({ icon, label, value }) => {
  return (
    <button
      className="flex items-center gap-2 cursor-pointer
                 bg-white/10 hover:bg-white/15
                 transition rounded-full px-3 py-2"
    >
      {icon}

      <span className="text-xs text-gray-200">{label}</span>

      <span
        className="ml-1 bg-gradient-to-r from-yellow-400 to-yellow-500
                   text-black font-semibold text-sm px-3 py-0.5 rounded-full"
      >
        {value}
      </span>
    </button>
  );
};
