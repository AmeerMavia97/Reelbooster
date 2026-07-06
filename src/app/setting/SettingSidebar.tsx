"use client";
import React from "react";
import { motion } from "framer-motion";
import { IoChevronBackOutline } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserProfile } from "../store/api/updateUser";
import Cookies from "js-cookie";
import SettingSidebarOptions from "./SettingSidebarOptions";

export default function SettingSidebar({
  onBack,
  onSelect,
}: {
  onBack: () => void;
  onSelect?: (path: string) => void;
}) {
  const router = useRouter();
  const token = Cookies.get("Reelboost_auth_token");
    const { data:userData } = useUserProfile(token ?? "");
  

  return (
    <motion.div
      key="settings"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex sm:overflow-y-hidden sticky top-0 h-screen no-scrollbar sm:w-[350px] sm:pt-[60px] flex-col"
      style={{ boxShadow: "2px 2px 4.3px 0px #00000008" }}
    >
      <div  >
        {/* Header */}
        <div className="relative w-full sm:h-16 flex items-center px-4 border-b">
          <button
            onClick={onBack}
            className="text-dark font-semibold text-lg cursor-pointer flex items-center gap-2"
          >
            <IoChevronBackOutline size={22} />
            <span>Settings</span>
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center py-6">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={userData?.data.profile_pic || ""}
              width={128}
              height={128}
              alt="profile"
              className="object-cover w-full h-full"
            />
          </div>
          <p
            className="mt-4 font-semibold text-lg text-dark-gray cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            {userData?.data.user_name}
          </p>
          <p className="text-sm text-gray">{userData?.data.email}</p>
        </div>

        {/* Sidebar Options */}
        <div className="mt-6">
          <SettingSidebarOptions onSelect={onSelect} />
        </div>
      </div>
    </motion.div>
  );
}
         