"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  seconds?: number;
  onComplete: () => void;
}

export default function StreamLoadingCountDonw({
  open,
  seconds = 5,
  onComplete,
}: Props) {
  const [count, setCount] = useState(seconds);
  const completedRef = useRef(false);

  // Reset when opened (UNCHANGED)
  useEffect(() => {
    if (!open) return;

    setCount(seconds);
    completedRef.current = false;
  }, [open, seconds]);

  // Countdown logic (UNCHANGED)
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

  // Instead of Dialog open={open}
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md">
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        <span
          key={count}
          className="
            select-none
            font-extrabold
            tracking-tight
            transition-all
            duration-700
            ease-out
            text-white
            text-[120px]
          "
        >
          {count}
        </span>

        <p className="absolute bottom-16 text-gray-300 text-lg tracking-wide">
          Going live...
        </p>
      </div>
    </div>
  );
}
