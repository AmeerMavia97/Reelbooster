"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch } from "@/app/utils/hooks";
import Cookies from "js-cookie";
import { showModal } from "@/app/store/Slice/ModalsSlice";
import {
  clearHashtagId,
  clearUserId,
} from "@/app/store/Slice/UserIdHashtagIdSlice";
import PopularHashtags from "./PopularHashtags";
import SuggestedAccounts from "./SuggestedAccounts";
import Image from "next/image";

interface SidebarProps {
  onNavigate: (type: "main" | "settings") => void;
}

type SidebarOption = {
  name: string;
  route?: string;
};


function Sidebar({ onNavigate }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [selectedButton, setSelectedButton] = useState(pathname);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    setSelectedButton(pathname);
  }, [pathname]);

  const token = Cookies.get("Reelboost_auth_token");
  // const handleButtonClick = (option: any) => {
  //   if (!token) {
  //     dispatch(showModal("Signin"));
  //   } else {
  //     if (option.route) {
  //       router.push(option.route);
  //       setSelectedButton(option.route);
  //       dispatch(clearHashtagId());
  //       setActiveSection(null);
  //       clearUserId();
  //     } else {
  //       setActiveSection(option.name);
  //       clearUserId();
  //     }
  //   }
  // };

  // inside function Sidebar(props)

  const handleButtonClick = (option: SidebarOption) => {
    if (!token) {
      dispatch(showModal("Signin"));
    } else {
      if (option.route) {
        if (option.name === "Setting") {
          router.push("/setting");
          onNavigate("settings");
        } else {
          router.push(option.route);
          setSelectedButton(option.route);
          dispatch(clearHashtagId());
          setActiveSection(null);
          clearUserId();
        }
      } else {
        setActiveSection(option.name);
        clearUserId();
      }
    }
  };

  const options = [
    {
      name: "For You",
      src: "/SidebarIcons/home.png",
      src1: "/SidebarIcons/home1.png",
      route: "/",
    },
    {
      name: "Explore",
      src: "/SidebarIcons/explore.png",
      src1: "/SidebarIcons/explore1.png",
      route: "/explore",
    },
    {
      name: "Following",
      src: "/SidebarIcons/Following.png",
      src1: "/SidebarIcons/Following1.png",
      route: "/following",
    },
    {
      name: "Live",
      src: "/SidebarIcons/live.png",
      src1: "/SidebarIcons/live1.png",
      route: "/live",
    },
    {
      name: "Profile",
      src: "/SidebarIcons/profile.png",
      src1: "/SidebarIcons/profile1.png",
      route: "/profile",
    },
    {
      name: "Reels",
      src: "/SidebarIcons/reels.png",
      src1: "/SidebarIcons/reels1.png",
      route: "/reels",
    },
    {
      name: "Setting",
      src: "/SidebarIcons/setting.png",
      src1: "/SidebarIcons/Setting1.png",
      route: "/setting",
    },
  ];




  // Hide sidebar on streaming pages
  // if (pathname.startsWith("/streaming")) {
  //   return null;
  // }


  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed overflow-y-auto h-screen no-scrollbar w-[270px] sm:pt-[60px] my-5 pr-4 py-5 shadow-md flex-col justify-between max-h-screen bg-[#FFFFFF]">
        <div className="flex flex-col gap-8">
          {/* Sidebar menu */}
          <div className="space-y-3">
            {options
              .filter((option) =>
                [
                  "For You",
                  "Explore",
                  "Following",
                  "Live",
                  "Profile",
                  "Setting",
                ].includes(option.name)
              )
              .map((option) => {
                const isActive =
                  activeSection === option.name ||
                  selectedButton === option.route;
                return (
                  <button
                    key={option.name}
                    onClick={() => handleButtonClick(option)}
                    className={`xl:flex xl:items-center justify-between px-10 py-3 w-full transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "xl:rounded-r-2xl text-main-green background-opacityGradient"
                        : "text-dark"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <Image
                        src={isActive ? option.src1 : option.src}
                        alt={option.name}
                        width={25}
                        height={25}
                      />
                      <span
                        className={`font-gilroy_md text-[16px] lg:block hidden ${
                          isActive ? "font-medium" : ""
                        }`}
                      >
                        {option.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            <SuggestedAccounts />
            <PopularHashtags />
          </div>
        </div>
      </div>

      {/* Top Navigation - Mobile */}
      {!["/message", "/"].includes(pathname) && (
        <div className="lg:hidden fixed top-0 w-full bg-primary z-50">
          <div className="flex justify-between px-5 py-2">
            {/* Logo */}
            <div className="flex gap-2 items-center">
              <Image src="/assets/logo.png" alt="logo" width={30} height={30} />
            </div>

            {/* Top Right Icons */}
            <div className="flex gap-4">
              {options
                .filter((opt) => ["Notification", "message"].includes(opt.name))
                .map((option) => {
                  const isActive =
                    activeSection === option.name ||
                    selectedButton === option.route;
                  return (
                    <button
                      key={option.name}
                      onClick={() => handleButtonClick(option)}
                      className="flex flex-col items-center"
                    >
                      <Image
                        src={isActive ? option.src1 : option.src}
                        alt={option.name}
                        width={25}
                        height={25}
                      />
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Mobile */}
      {!["/message"].includes(pathname) && (
        <div className="lg:hidden fixed bottom-0 w-full bg-primary shadow-md z-50">
          <div className="flex justify-around items-center py-2">
            {options
              .filter((opt) =>
                ["For You", "Explore", "Following", "Live", "Profile"].includes(
                  opt.name
                )
              )
              .map((option) => {
                const isActive =
                  activeSection === option.name ||
                  selectedButton === option.route;
                return (
                  <button
                    key={option.name}
                    onClick={() => handleButtonClick(option)}
                    className="flex flex-col items-center justify-center text-xs"
                  >
                    <Image
                      src={isActive ? option.src1 : option.src}
                      alt={option.name}
                      width={23}
                      height={23}

                    />
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
