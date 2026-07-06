"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import useApiPost from "@/app/hooks/postData";
import { useGiftCategories } from "@/app/store/api/getGiftCategories";
import { useAppSelector } from "@/app/utils/hooks";
import { socketInstance } from "@/app/socket/socket";
import SendgiftAnimation from "./SendgiftAnimation";

import Icon from "../../../../public/gift/coin-removebg-preview.png";
import { toast } from "react-toastify";
import { useUserProfile } from "@/app/store/api/updateUser";
import Cookies from "js-cookie";

// TYPES
interface GiftItem {
  gift_id: number;
  name: string;
  image: string;
  gift_thumbnail: string;
  gift_value: number;
  category_id?: number;
}

interface GiftCategory {
  gift_category_id: number;
  name: string;
}

// CATEGORY TABS
const CategoryTabs: React.FC<{
  categories: GiftCategory[];
  selectedCategory: number | null;
  onSelect: (id: number | null) => void;
}> = ({ categories, selectedCategory, onSelect }) => (
  <div className="w-full flex gap-4 overflow-x-auto scrollbar-hide px-2 py-2">
    <button
      onClick={() => onSelect(null)}
      className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${selectedCategory === null
        ? "bg-[#1A9D77] text-white"
        : "bg-gray-200 text-gray-700"
        }`}
    >
      All
    </button>

    {categories.map((cat) => (
      <button
        key={cat.gift_category_id}
        onClick={() => onSelect(cat.gift_category_id)}
        className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${selectedCategory === cat.gift_category_id
          ? "bg-[#1A9D77] text-white"
          : "bg-gray-200 text-gray-700"
          }`}
      >
        {cat.name}
      </button>
    ))}
  </div>
);

// GIFT CARD
const GiftCard: React.FC<{
  gift: GiftItem;
  onGiftSent: (gift: GiftItem) => void;
}> = ({ gift, onGiftSent }) => {
  const socket = socketInstance();
  const { postData } = useApiPost();
  const liveUser = useAppSelector((state) => state.viewStream.records[0]);
  const socialId = useAppSelector((state) => state.selectedReel.ReelId);
  const token = Cookies.get("Reelboost_auth_token");
  const { refetch } = useUserProfile(token ?? "");

  const [loading, setLoading] = useState(false);

  const handleSendGift = async () => {
    const recieverUserId = liveUser.User.user_id;
    if (!recieverUserId) {
      toast.error("Recipient not found!");
      return;
    }

    setLoading(true);

    try {
      const res: any = await postData("/transaction/send-gift", {
        reciever_id: recieverUserId,
        gift_id: gift.gift_id,
        social_id: socialId || null,
        quantity: 1,
        transaction_ref: socialId ? "social" : "live",
      });

      if (res.status) {
        toast.success("Gift sent successfully 🎁");

        socket.emit("gift_recived", {
          room_id: liveUser.Live.socket_room_id,
          gift,
          sender_id: recieverUserId,
        });

        onGiftSent(gift); // 🔥 trigger animation
        refetch();
      } else {
        toast.error(res.message || "Failed to send gift");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0f0f15] border border-gray-700">
      <div className="flex items-center gap-4">
        <div className="relative w-10 h-10">
          <Image
            src={gift.gift_thumbnail || gift.image}
            alt={gift.name}
            fill
            className="object-contain"
          />
        </div>

        <div>
          <p className="text-white font-semibold">{gift.name}</p>
          <div className="flex items-center gap-1">
            <span className="text-white">{gift.gift_value}</span>
            <Image src={Icon} alt="coin" width={18} height={18} />
          </div>
        </div>
      </div>

      <button
        onClick={handleSendGift}
        disabled={loading}
        className="px-4 py-2 bg-main-green  cursor-pointer rounded-xl text-white text-sm"
      >
        {loading ? "Sending..." : "Send Gift"}
      </button>
    </div>
  );
};

// MAIN COMPONENT
const ViewStreamingRightSideGiftList: React.FC = () => {
  const { postData } = useApiPost();
  const [giftList, setGiftList] = useState<GiftItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [animatedGift, setAnimatedGift] = useState<GiftItem | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const { data: categoryData } = useGiftCategories(1);
  const categories = categoryData?.data?.Records || [];

  const fetchGifts = useCallback(async () => {
    const payload: any = { page };
    if (selectedCategory === null) payload.all = true;
    else payload.gift_category_id = selectedCategory;

    const res = await postData("/gift/get-gift", payload);
    const records = res?.data?.Records || [];

    if (page === 1) setGiftList(records);
    else setGiftList((prev) => [...prev, ...records]);

    setHasMore(records.length > 0);
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  return (
    <div className="w-full flex flex-col gap-4 px-8 absolute top-16">

      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div ref={listRef} className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
        {giftList.map((gift) => (
          <GiftCard
            key={gift.gift_id}
            gift={gift}
            onGiftSent={(gift) => {
              setAnimatedGift(gift);
              setTimeout(() => setAnimatedGift(null), 3000);
            }}
          />
        ))}
      </div>

      {animatedGift && (
        <SendgiftAnimation
          key={animatedGift.gift_id + Date.now()} // Force remount for fresh animation
          giftImage={animatedGift.gift_thumbnail || animatedGift.image}
          duration={5000}
          onAnimationEnd={() => setAnimatedGift(null)}
        />
      )}

    </div>
  );
};

export default ViewStreamingRightSideGiftList;
