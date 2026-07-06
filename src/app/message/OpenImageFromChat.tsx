"use client";
import Image from "next/image";
import React from "react";
import { hideModal } from "../store/Slice/ModalsSlice";
import { useAppDispatch } from "../utils/hooks";
import { normalizeMediaUrl } from "../utils/mediaUrl";

function PreviewComponent({ url }:{url:string}) {

  const dispatch = useAppDispatch();
  const mediaUrl = normalizeMediaUrl(url);
  const handleCloseModal = () => {
    dispatch(hideModal("OpenImageFromChat"))
  }
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-dark/[0.60] backdrop-blur-sm z-1000">
        <button
          onClick={handleCloseModal}
          className="absolute top-0 text-2xl right-1 cursor-pointer text-primary rounded-full p-2 transition"
        >
          ✕
        </button>
        <div className=" rounded-2xl shadow-xl w-[50%] h-[80%] relative">
          {/* For the Image open */}
          <div className="w-full h-full rounded-2xl">
            <Image
              src={mediaUrl}
              className="w-full h-full object-contain rounded-2xl"
              alt="Image"
              width={1000}
              height={1000}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PreviewComponent;
