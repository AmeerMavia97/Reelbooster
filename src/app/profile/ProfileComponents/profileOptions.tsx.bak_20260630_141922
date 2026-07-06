"use client";
import React, { useEffect, useState } from "react";
import UserReels from "./UserReels";
import UserLikes from "./UserLikes";
import UserGifts from "./UserGifts";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import useApiPost from "@/app/hooks/postData";
import { useAppSelector } from "@/app/utils/hooks";

function ProfileOptions() {
  const pathname = usePathname();
  const MyUserId = Cookies.get("Reelboost_user_id");
  const selectedUserId = useAppSelector((state) => state.userId.user_id);

  const [activeTab, setActiveTab] = useState("Reels");
  const [counts, setCounts] = useState({
    Reels: 0,
    Likes: 0,
    Gifts: 0,
  });

  const { postData } = useApiPost();

  // fetch totals immediately on mount
  useEffect(() => {
    const userId =
      pathname === "/profile"
        ? Number(MyUserId)
        : Number(selectedUserId || MyUserId); // fallback to MyUserId

    if (!userId) return; // safeguard

    const fetchTotals = async () => {
      try {
        const [reelsRes, likesRes, giftsRes] = await Promise.all([
          postData("/social/get-social", {
            social_type: "reel",
            page: 1,
            user_id: userId,
          }),
          postData("/like/like-list", {
            include: "Social",
            like_by: userId,
            page: 1,
          }),
          postData("/transaction/history", {
            page: 1,
            reciever_id: userId,
            transaction_table: "coin",
            profile_data: true,
          }),
        ]);

        setCounts({
          Reels: reelsRes?.data?.Pagination?.total_records || 0,
          Likes: likesRes?.data?.Pagination?.total_records || 0,
          Gifts: giftsRes?.data?.Pagination?.total_records || 0,
        });
      } catch (err) {
      }
    };

    fetchTotals();
  }, [selectedUserId, MyUserId, pathname]);

  const tabs = ["Reels", "Likes", "Gifts"] as const;
  type TabKey = keyof typeof counts; // "Reels" | "Likes" | "Gifts"

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex justify-center w-full mt-5 border-b border-main-green/[0.35]">
        {tabs.map((tab, index) => (
          <React.Fragment key={tab}>
            <button
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-sm relative font-medium sm:px-6 py-2 cursor-pointer transition-colors duration-200
                ${
                  activeTab === tab
                    ? "text-main-green"
                    : "text-gray-500 hover:text-main-green"
                }
              `}
            >
              {tab} ({counts[tab as TabKey]})
              {activeTab === tab && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-[-1.5] sm:w-36 w-20 h-[2px] bg-main-green rounded-full" />
              )}
            </button>
            {index < tabs.length - 1 && (
              <div className="w-px my-3 bg-main-green/[0.35] self-stretch"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === "Reels" && <UserReels />}
        {activeTab === "Likes" && <UserLikes />}
        {activeTab === "Gifts" && <UserGifts />}
      </div>
    </>
  );
}

export default ProfileOptions;
