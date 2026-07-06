"use client";
import CustomDialog from "../components/CustomDialog";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { hideModal } from "../store/Slice/ModalsSlice";
import Image from "next/image";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

function GiftSentSuccessfully() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.GiftSentSuccessfully);
  const { selectedGiftImage, total } = useAppSelector((state) => state.gift);

  return (
    <>
      <CustomDialog
        open={open}
        onClose={() => dispatch(hideModal("GiftSentSuccessfully"))}
        width="420px"
      >
        <Confetti
          initialVelocityX={6}
          initialVelocityY={10}
          width={420}
          height={320}
        />
        <div className="relative flex flex-col items-center justify-center min-h-[320px] p-4 overflow-hidden">
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
              src={selectedGiftImage || ""}
              alt="coin"
              width={140}
              height={140}
              className="rounded-full p-3"
            />
          </motion.div>

          {/* Coin balance */}
          <div className="rounded-2xl background-opacityGradient flex items-center gap-3 px-3 py-1.5 mt-4 z-10">
            <Image src="/profile/coin.png" alt="coin" width={20} height={20} />
            <p className="font-medium text-[12px] text-dark">{total}</p>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-dark text-center mt-4 z-10">
            Wohaa Gift Sent!!
          </h3>

          {/* Description */}
          <p className="text-[#656565] w-44 text-sm text-center mt-2 z-10">
            You have successful sent the gift
          </p>
        </div>
      </CustomDialog>
    </>
  );
}

export default GiftSentSuccessfully;
