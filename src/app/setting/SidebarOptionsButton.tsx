"use client";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";

interface SidebarButtonProps {
  iconSrc: string;
  label: string;
  onClickFunc: () => void;
  isActive?: boolean;
  customClass?: string;
}

export default function SidebarOptionsButton({
  iconSrc,
  label,
  onClickFunc,
  isActive,
  customClass = "",
}: SidebarButtonProps) {

  return (
    <>
      <button
        onClick={onClickFunc}
        className={`flex justify-between items-center border-b cursor-pointer py-4 px-10 border-main-green/[0.18] ${
          isActive ? "text-main-green" : "text-dark"
        } ${customClass}`}
      >
        <div className="flex items-center gap-3">
          <Image src={iconSrc} alt={label} height={20} width={20} />
          <span className="text-sm">{label}</span>
        </div>
        <IoIosArrowBack
          className={`rotate-180 ${isActive ? "text-main-green" : "text-dark"}`}
          
        />
      </button>
    </>
  );
}
