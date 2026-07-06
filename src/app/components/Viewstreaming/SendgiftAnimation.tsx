"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Confetti from "react-confetti";

interface SendgiftAnimationProps {
  giftImage: string;
  duration?: number;
  onAnimationEnd?: () => void;
}

const SendgiftAnimation: React.FC<SendgiftAnimationProps> = ({
  giftImage,
  duration = 6000,
  onAnimationEnd,
}) => {
  const [show, setShow] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  useEffect(() => {
    if (!giftImage) return;

    setShow(true);

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const timer = setTimeout(() => {
      setShow(false);
      onAnimationEnd?.();
    }, duration);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [giftImage, duration, onAnimationEnd]);

  if (!show || !giftImage) return null;

  return (
    <div className="fixed inset-0 z-[999999] pointer-events-none overflow-hidden">
      {/* FULL POWER EXPLOSIVE CONFETTI - NO DIMMING */}
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        numberOfPieces={900}
        recycle={false}
        gravity={0.2}
        initialVelocityY={{ min: -10, max: -60 }}
        initialVelocityX={{ min: -20, max: 20 }}
        wind={0.05}
        opacity={1}                    // Full opacity - super bright!
        tweenDuration={6000}
        colors={[
          "#FF577F", "#FF884B", "#FFB200", "#FFCF96",
          "#8D72E1", "#6C5CE7", "#5F27CD", "#00B8A9",
          "#F9ED69", "#F08A4B", "#D9374D", "#FFD93D",
          "#A8E6CF", "#FF8B94", "#B983FF", "#6C63FF",
        ]}
        confettiSource={{
          x: dimensions.width / 2,
          y: dimensions.height / 2 - 50,
          w: 200,
          h: 200,
        }}
        drawShape={(ctx) => {
          const rand = Math.random();
          const size = 4 + Math.random() * 6;

          if (rand < 0.35) {
            // Star
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
              ctx.lineTo(
                Math.cos((18 + i * 72) / 180 * Math.PI) * size,
                -Math.sin((18 + i * 72) / 180 * Math.PI) * size
              );
              ctx.lineTo(
                Math.cos((54 + i * 72) / 180 * Math.PI) * (size / 2),
                -Math.sin((54 + i * 72) / 180 * Math.PI) * (size / 2)
              );
            }
            ctx.closePath();
            ctx.fill();
          } else if (rand < 0.65) {
            // Heart
            ctx.beginPath();
            ctx.moveTo(0, size);
            ctx.bezierCurveTo(-size * 1.5, -size * 1.5, -size * 1.5, size / 2, 0, size * 1.5);
            ctx.bezierCurveTo(size * 1.5, size / 2, size * 1.5, -size * 1.5, 0, size);
            ctx.closePath();
            ctx.fill();
          } else if (rand < 0.85) {
            // Circle
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Diamond
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-size, -size, size * 2, size * 2);
          }
        }}
      />

      {/* OPTIONAL: Very light quick flash - removed background dimming */}
      <div className="absolute inset-0 animate-quickFlash pointer-events-none" />

      {/* GIFT FLYING UP */}
      <div className="absolute inset-0 flex bottom-[30%] items-end justify-center pb-10">
        <div className="animate-giftFlyUp">
          <Image
            src={giftImage}
            alt="Gift"
            width={120}
            height={120}
            className="object-contain drop-shadow-2xl"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* CUSTOM ANIMATIONS - NO BACKDROP BLUR OR OPACITY */}
      <style jsx>{`
        @keyframes giftFlyUp {
          0% {
            transform: translateY(120vh) scale(0.3) rotate(-60deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-80px) scale(1.8) rotate(15deg);
            opacity: 1;
          }
          70% {
            transform: translateY(20px) scale(1.4) rotate(-8deg);
          }
          85% {
            transform: translateY(-10px) scale(1.5);
          }
          100% {
            transform: translateY(0) scale(1.3) rotate(0deg);
            opacity: 1;
          }
        }

        .animate-giftFlyUp {
          animation: giftFlyUp 2.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

       
      `}</style>
    </div>
  );
};

export default SendgiftAnimation;