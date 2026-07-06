"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  TelegramShareButton,
} from "react-share";

interface ShareStreamBtnProps {
  url: string;
  title?: string;
}

const ShareStreamBtn: React.FC<ShareStreamBtnProps> = ({
  url,
  title = "Watch this live stream 🔴",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Share Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Share Stream"
        className="p-2 sm:p-3 rounded-full bg-white/10 text-white  cursor-pointer
                   hover:bg-white/20 transition backdrop-blur-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>

      {/* Share Options */}
      {open && (
        <div
          className="absolute right-0 top-full mt-3 flex flex-col gap-2 
                     bg-black/70 p-3 rounded-xl backdrop-blur-md z-50"
        >
          <FacebookShareButton url={url} quote={title}>
            <ShareItem label="Facebook" />
          </FacebookShareButton>

          <WhatsappShareButton url={url} title={title}>
            <ShareItem label="WhatsApp" />
          </WhatsappShareButton>

          <TwitterShareButton url={url} title={title}>
            <ShareItem label="Twitter" />
          </TwitterShareButton>

          <TelegramShareButton url={url} title={title}>
            <ShareItem label="Telegram" />
          </TelegramShareButton>
        </div>
      )}
    </div>
  );
};

export default React.memo(ShareStreamBtn);

const ShareItem = ({ label }: { label: string }) => (
  <div className="text-white text-sm px-3 py-2 rounded-lg 
                  bg-white/10 hover:bg-white/20 transition cursor-pointer">
    {label}
  </div>
);
