"use client";

import { useState } from "react";
import ReceiveTotalLikes from "./ReceiveTotalLikes";
import ReceiveTotalGifts from "./ReceiveTotalGifts";
import TotalGiftAndTotalCoins from "./TotalGiftAndTotalCoins";

export default function LikesGiftsTabs() {
  const [activeTab, setActiveTab] = useState<"gifts" | "likes">("gifts");

  return (
    <div className="relative w-full h-full flex flex-col rounded-lg">

      {/* Tabs + Content */}
      <div className="flex-1 flex flex-col gap-4 px-4 pt-4 pb-24 overflow-y-auto">
        {/* Tabs */}
        <div className="w-full flex">


          <button
            onClick={() => setActiveTab("gifts")}
            className={`w-1/2 py-3 cursor-pointer font-semibold border-b-2 transition
    ${activeTab === "gifts"
                ? "border-main-green text-main-green"
                : "border-transparent text-white hover:text-main-green"
              }`}
          >
          Receive Total Gifts
          </button>


          <button
            onClick={() => setActiveTab("likes")}
            className={`w-1/2 py-3 font-semibold border-b-2  cursor-pointer transition
              ${activeTab === "likes"
                ? "border-main-green text-main-green"
                : "border-transparent text-white hover:text-main-green"
              }`}
          >
          Receive Total Likes
          </button>

        </div>

        {/* Content */}
        {activeTab === "likes" && <ReceiveTotalLikes />}
        {activeTab === "gifts" && <ReceiveTotalGifts />}
      </div>

      {/* Bottom Fixed Bar */}
      <TotalGiftAndTotalCoins />
    </div>
  );
}
