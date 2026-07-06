"use client";
import React, { useEffect, useState } from "react";
import CustomDialog from "../components/CustomDialog";
import { useAppDispatch } from "../utils/hooks";
import { hideModal } from "../store/Slice/ModalsSlice";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { RiCoinFill } from "react-icons/ri";
import Cookies from "js-cookie";

function FreeCoinPopup() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [showCoins, setShowCoins] = useState(false);

  // Open popup if cookie is true
  useEffect(() => {
    const hasSeenPopup = Cookies.get("FreeCoinPopup");
    if (hasSeenPopup === "true") {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowCoins(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowCoins(false);
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    Cookies.set("FreeCoinPopup", "false"); // prevent showing again
    dispatch(hideModal("FreeCoin"));
  };

  return (
    <CustomDialog open={open} onClose={handleClose} width="420px">
      <div className="relative flex flex-col items-center justify-center min-h-[320px] p-4 overflow-hidden">
        {/* Falling coins */}
        <AnimatePresence>
          {showCoins &&
            Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, opacity: 0, x: Math.random() * 300 - 150 }}
                animate={{
                  y: [0, 340],
                  opacity: [1, 0],
                  x: Math.random() * 300 - 150,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2.5 + Math.random(),
                  delay: Math.random() * 1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute top-0"
              >
                <RiCoinFill className="text-yellow-600 text-2xl" />
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Main coin */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="background-opacityGradient p-0.5 rounded-full w-20 h-20 flex items-center justify-center z-10"
        >
          <Image
            src={"/profile/coin.png"}
            alt="coin"
            width={140}
            height={140}
            className="rounded-full p-3"
          />
        </motion.div>

        {/* Coin balance */}
        <div className="rounded-2xl background-opacityGradient flex items-center gap-3 px-3 py-1.5 mt-4 z-10">
          <Image src="/profile/coin.png" alt="coin" width={20} height={20} />
          <p className="font-medium text-[12px] text-dark">500</p>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-dark text-center mt-4 z-10">
          Congratulations!!!
        </h3>

        {/* Description */}
        <p className="text-[#656565] text-sm text-center mt-2 z-10">
          You have received 500 coins free on your successful registration, enjoy
          buying gifts.
        </p>
      </div>
    </CustomDialog>
  );
}

export default FreeCoinPopup;
