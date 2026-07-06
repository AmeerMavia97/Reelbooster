"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface DemoComment {
  fullName: string;
  profilePic: string;
  commentContent: string;
}

const staticComments: DemoComment[] = [
  { fullName: "Sophia", profilePic: "/demo/sophia_profile_photo.jpg", commentContent: "Hello!!" },
  { fullName: "Olivia", profilePic: "/demo/olivia_profile_photo.jpg", commentContent: "Hello, I am here!!" },
  { fullName: "Amelia", profilePic: "/demo/amelia_profile_photo.jpg", commentContent: "Is this a giveaway live?" },
  {
    fullName: "Isla",
    profilePic: "/demo/isla_profile_photo.jpg",
    commentContent:
      "I am excited to have this giveaway, looking forward if I get the chance.",
  },
  {
    fullName: "Jack",
    profilePic: "/demo/jack_profile_photo.jpg",
    commentContent: "When you collaborate with channel? I am interested too.",
  },
  {
    fullName: "Mia",
    profilePic: "/demo/mia_profile_photo.jpg",
    commentContent:
      "This live is so knowledgeable, it’s good cause with knowledge and giveaway!!",
  },
  {
    fullName: "Emily",
    profilePic: "/demo/emily_profile_photo.jpg",
    commentContent: "Let us know soon who is lucky one to get a giveaway??",
  },
  {
    fullName: "Harry",
    profilePic: "/demo/harry_profile_photo.jpg",
    commentContent: "Waiting!!! To Start !!!",
  },
];

function DemoComments() {
  const [visibleComments, setVisibleComments] = useState<DemoComment[]>([]);

  useEffect(() => {
    let index = 0;
    let timeoutId: NodeJS.Timeout;

    const showNextComment = () => {
      if (index >= staticComments.length) return;

      const current = staticComments[index];
      setVisibleComments((prev) => [...prev, current]);

      // ⏱ Delay based on content length
      const delay =
        Math.min(Math.max(current.commentContent.length * 80, 2000), 6000);

      index++;
      timeoutId = setTimeout(showNextComment, delay);
    };

    showNextComment();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="space-y-2">
      {visibleComments.map((c, i) => (
        <div key={i} className="flex items-start gap-2">
          <Image
            src={c.profilePic}
            alt={c.fullName}
            width={28}
            height={28}
            className="rounded-full"
          />
          <div className="flex flex-col text-primary max-w-[85%]">
            <span className="text-sm font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {c.fullName}
            </span>
            <span className="text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] break-words">
              {c.commentContent}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DemoComments;
