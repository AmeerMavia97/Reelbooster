"use client";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { hideModal, showModal } from "@/app/store/Slice/ModalsSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

function LogoutProfilePopup() {
  const popupRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const router = useRouter(); // ✅ manual routing

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        dispatch(hideModal("LogoutProfile"));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  return (
    <div className="relative" ref={popupRef}>
      <Image
        src="/profile/profilePopup.svg"
        className="absolute -top-1.5 right-3 -translate-y-1/2 z-0"
        alt="triangle"
        width={30}
        height={30}
      />
      <div
        className="relative bg-primary flex flex-col py-3 gap-3 sm:w-52 w-52 rounded-lg z-10 border"
        style={{ boxShadow: "0px 7px 10px 0px #00000026" }}
      >
        {/* ✅ Edit Profile with manual routing */}
        <div
          className="flex gap-2 px-5 cursor-pointer"
          onClick={() => {
            dispatch(hideModal("LogoutProfile"));
            router.push("/profile"); // manual navigation
          }}
        >
          <Image src="/SidebarIcons/profile.png" width={20} height={20} alt="profile" />
          <p className="text-dark font-light text-[14px]">My Profile</p>
        </div>

        {/* Logout */}
        <div
          className="flex gap-2 px-5 cursor-pointer place-items-center"
          onClick={() => {
            dispatch(showModal("Logout"));
            dispatch(hideModal("LogoutProfile"));
          }}
        >
          <Image src="/SidebarIcons/logout.png" alt="logout" width={18} height={18} />
          <p className="font-light text-[14px] text-red">Logout</p>

        </div>
      </div>
    </div>
  );
}

export default LogoutProfilePopup;
