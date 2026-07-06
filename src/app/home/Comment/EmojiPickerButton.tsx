// EmojiPickerButton.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";

interface EmojiPickerButtonProps {
  onSelect: (emoji: string) => void;
}

const EmojiPickerButton: React.FC<EmojiPickerButtonProps> = ({ onSelect }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative pt-2">
      <button
        type="button"
        onClick={() => setShowPicker((prev) => !prev)}
        className="text-xl"
      >
        <Image src="/home/smile.png" alt="smile" width={20} height={20}/>
      </button>

      {showPicker && (
        <div ref={pickerRef} className="absolute bottom-10 right-0 z-50">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              onSelect(emojiData.emoji);
              setShowPicker(false);
            }}
            height={350}
            width={300}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;
