"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "@mui/material";

interface Props {
  open: boolean;
  seconds?: number;
  onComplete: () => void;
}

export default function LiveCountdownModal({
  open,
  seconds = 5,
  onComplete,
}: Props) {
  const [count, setCount] = useState(seconds);
  const completedRef = useRef(false);

  // Reset when opened
  useEffect(() => {
    if (!open) return;

    setCount(seconds);
    completedRef.current = false;
  }, [open, seconds]);

  // Countdown logic
  useEffect(() => {
    if (!open) return;

    if (count === 0) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, open, onComplete]);

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      keepMounted
      BackdropProps={{
        sx: {
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0,0,0,0.7)",
        },
      }}
      PaperProps={{
        sx: {
          backgroundColor: "black",
          borderRadius: "18px",
          width: { xs: "90vw", sm: 500 },
          height: { xs: "90vh", sm: 840 },
          maxWidth: "none",
          overflow: "hidden",
        },
      }}
    >
      {/* Animated Content */}
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        <span
          key={count}
          className={`
            select-none
            font-extrabold
            tracking-tight
            transition-all
            duration-700
            ease-out

           text-white text-[120px] scale-100 opacity-100
          `}
        >
          {count}
        </span>

        <p className="absolute bottom-16 text-gray-300 text-lg tracking-wide">
          Going live...
        </p>

      </div>
    </Dialog>
  );
}
