"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/app/utils/hooks";
import { hideModal, showModal } from "@/app/store/Slice/ModalsSlice";

function SelectOption() {
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClose = () => dispatch(hideModal("Options"));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="bg-white border border-gray-200 shadow-md rounded-md p-2 w-40"
    >
      <button
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left"
        onClick={() => {
          handleClose();
          dispatch(showModal("ReportUser"));
        }}
      >
        <Image src="/profile/report.png" alt="Report" width={16} height={16} />
        <span className="text-red text-sm">Report</span>
      </button>

      <button
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 w-full text-left"
        onClick={() => {
          handleClose();
          dispatch(showModal("BlockUser"));
        }}
      >
        <Image src="/profile/block.png" alt="Block" width={16} height={16} />
        <span className="text-red text-sm">Block</span>
      </button>
    </div>
  );
}

export default SelectOption;
