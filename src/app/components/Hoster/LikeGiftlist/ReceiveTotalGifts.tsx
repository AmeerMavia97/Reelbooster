"use client";

import { useAppSelector } from "@/app/utils/hooks";
import Image from "next/image";
import React from "react";

function ReceiveTotalGifts() {
  const { gifts = [] } = useAppSelector((state) => state.gifts);

  if (!gifts.length) {
    return (
      <div className="text-center h-full flex justify-center items-center w-full text-gray-500 py-8 text-sm">
        No gifts received yet 🎁
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {gifts.map((gift, index) => (
        <div
          key={index}
          className="
            w-full flex items-center justify-between
            bg-[#0d0d0d] border border-gray-800
            rounded-2xl px-4 py-3
            hover:border-main-green hover:bg-[#111]
            transition-all duration-200
          "
        >
          {/* LEFT: Gift Info (Primary) */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src={gift.gift_thumbnail}
                alt={gift.giftName}
                fill
                className="object-contain"
              />
            </div>

            <div>
              <p className="text-white font-semibold leading-tight">
                {gift.giftName}
              </p>
              <span className="text-yellow-400 text-sm font-bold">
                🪙 {gift.coinsValue}
              </span>
            </div>
          </div>

          {/* RIGHT: User Info (Secondary) */}
          <div className="flex items-center gap-3 text-right">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-700 flex-shrink-0">
              <Image
                src={gift.profile_pic ?? "/default-avatar.png"}
                alt={gift.user_name ?? "User"}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {gift.full_name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                @{gift.user_name}
              </p>
            </div>


          </div>
        </div>
      ))}
    </div>
  );
}

export default ReceiveTotalGifts;
