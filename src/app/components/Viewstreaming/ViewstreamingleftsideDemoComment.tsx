"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";

interface DemoComment {
  fullName: string;
  profilePic: string;
  commentContent: string;
}

const staticComments: DemoComment[] = [
  { fullName: "Sophia", profilePic: "/demo/sophia_profile_photo.jpg", commentContent: "Hello!!" },
  { fullName: "Olivia", profilePic: "/demo/olivia_profile_photo.jpg", commentContent: "Hello, I am here!!" },
  { fullName: "Amelia", profilePic: "/demo/amelia_profile_photo.jpg", commentContent: "Is this a giveaway live?" },
  { fullName: "Isla", profilePic: "/demo/isla_profile_photo.jpg", commentContent: "I am excited for this giveaway!" },
  { fullName: "Jack", profilePic: "/demo/jack_profile_photo.jpg", commentContent: "When is next collaboration?" },
  { fullName: "Mia", profilePic: "/demo/mia_profile_photo.jpg", commentContent: "This live is so good!!" },
  { fullName: "Emily", profilePic: "/demo/emily_profile_photo.jpg", commentContent: "When will you announce the winner?" },
  { fullName: "Harry", profilePic: "/demo/harry_profile_photo.jpg", commentContent: "Waiting to start!" },
];

function ViewstreamingleftsideDemoComment() {
  const [visibleComments, setVisibleComments] = useState<DemoComment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    let timer: NodeJS.Timeout;

    const showNext = () => {
      if (index >= staticComments.length) return;

      const current = staticComments[index];
      setVisibleComments((prev) => [...prev, current]);

      if (scrollRef.current) scrollRef.current.scrollTop = 0;

      const delay = Math.min(
        Math.max(current.commentContent.length * 80, 2000),
        6000
      );

      index++;
      timer = setTimeout(showNext, delay);
    };

    showNext();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex-1 flex flex-col-reverse gap-4 overflow-y-auto"
    >
      {visibleComments.map((c, i) => (
        <div key={i} className="flex items-start gap-3 animate-fadeIn">
          <Image
            src={c.profilePic}
            alt={c.fullName}
            width={40}
            height={40}
            className="rounded-full shadow-md"
          />
          <div className="flex flex-col max-w-[65%]">
            <span className="text-xs text-gray-300">{c.fullName}</span>
            <span className="text-xs sm:text-sm text-white break-words">
              {c.commentContent}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewstreamingleftsideDemoComment;
