"use client"
import CustomDialog from "../components/CustomDialog";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { hideModal } from "../store/Slice/ModalsSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";

function InsufficientBalance() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.InsufficientBalance);
  const router = useRouter();
  const isLive = useAppSelector((state) => state.modals.LivePopup)

  return (
    <CustomDialog
      open={open}
      onClose={() => dispatch(hideModal("InsufficientBalance"))}
      width="420px"
    >
      <div className="relative flex flex-col items-center justify-center py-8 p-4 overflow-hidden">
        {/* Main coin with continuous pop animation */}
        <div className="background-opacityGradient p-0.5 rounded-full w-20 h-20 flex items-center justify-center z-10">
          <Image
            src={"/gift/insufficientBalance.png"}
            alt="coin"
            width={160}
            height={160}
            className="rounded-full p-3 w-52 "
          />
        </div>

        {/* title */}
        <h3 className="text-xl font-semibold text-dark text-center mt-4 z-10">
          Insufficient Balance
        </h3>

        {/* text */}
        <p className="text-[#656565] text-sm text-center mt-2 px-8 z-10">
          Insufficient balance. Please add funds to complete the transaction.
        </p>

        {/* Recharge button */}
        <button
          className={`w-4/5 text-sm rounded-xl py-3 mt-8
                bg-main-green text-primary cursor-pointer`}
          onClick={() => {
            dispatch(hideModal("SendGift"));
            dispatch(hideModal("InsufficientBalance"));
            router.push("/setting/recharge");
            if(isLive) {
              dispatch(hideModal("LivePopup"))
            }
          }}
        >
          Recharge
        </button>
      </div>
    </CustomDialog>
  );
}

export default InsufficientBalance;
