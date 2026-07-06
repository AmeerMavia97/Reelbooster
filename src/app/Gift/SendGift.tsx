"use client";
import React, { useRef, useEffect } from "react";
import CustomDialog from "../components/CustomDialog";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { hideModal, showModal } from "../store/Slice/ModalsSlice";
import GiftCategories from "./GiftCategories";
import { useGifts } from "../store/api/getGift";
import {
  setSelectedGift,
  incrementQuantity,
  decrementQuantity,
  resetGift,
} from "../store/Slice/selectedGiftCategorySlice";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import Cookies from "js-cookie";
import { SendGiftRes } from "../types/Gift";
import useApiPost from "../hooks/postData";
import { toast } from "react-toastify";
import { clearUserId } from "../store/Slice/UserIdHashtagIdSlice";
import { clearSelectedReel } from "../store/Slice/SelectedReelDetail";
import { useUserProfile } from "../store/api/updateUser";
import { socketInstance } from "../socket/socket";

function SendGift() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.modals.SendGift);
  const { selectedCategoryId, selectedGiftId, selectedGiftValue, quantity } =
    useAppSelector((state) => state.gift);
  const { postData } = useApiPost();

  const socialId = useAppSelector((state) => state.selectedReel.ReelId);
  const recieverUserIdRedux = useAppSelector((state) => state.userId.user_id);

  const liveState = useAppSelector((state) => state.live);
  // get recipient dynamically from live if live modal is open
  const recieverUserId = liveState.user_id || recieverUserIdRedux;


  const seletesuserdata  = useAppSelector((state) => state.live.selectedLive?.socket_room_id);


  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGifts(selectedCategoryId);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      },
      { threshold: 1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const total = selectedGiftValue * quantity;
  const token = Cookies.get("Reelboost_auth_token");
  const { data: userData } = useUserProfile(token ?? "");
    const socket = socketInstance();
  

  const handleGiftSend = async () => {
    if (!recieverUserId) {
      // toast.error("Recipient not found!");
      return;
    }

    try {
      const res: SendGiftRes = await postData("/transaction/send-gift", {
        reciever_id: recieverUserId,
        gift_id: selectedGiftId,
        social_id: socialId || null, // null for live
        quantity,
        transaction_ref: socialId ? "social" : "live",
      });

      if (res.status) {
        toast.success(res.message);
        dispatch(hideModal("SendGift"));
        dispatch(showModal("GiftSentSuccessfully"));
        dispatch(clearUserId());
        dispatch(clearSelectedReel());
         socket.emit("gift_recived", {
      seletesuserdata,
      
    });
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to send gift!");
    }
  };

  const handleRecharge = () => {
    if (Number(userData?.data?.available_coins ?? 0) < total) {
      dispatch(showModal("InsufficientBalance"));
    } else {
      handleGiftSend();
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={() => {
        dispatch(hideModal("SendGift"));
        dispatch(resetGift());
      }}
      width="450px"
    >
      <div className="p-4">
        <GiftCategories />

        <div className="grid grid-cols-3 gap-4 mt-4 max-h-[550px] scrollbar-hide overflow-y-auto">
          {isLoading && (
            <div className="min-h-[550px] flex justify-center items-center">
              <ClipLoader color="#1A9D77" size={15} />
            </div>
          )}
          {isError && <p>Failed to load gifts</p>}
          {!isLoading &&
            data?.pages.map((page, pageIndex) =>
              page?.data?.Records.map((gift) => (
                <div
                  key={`${pageIndex}-${gift.gift_id}`}
                  onClick={() =>
                    dispatch(
                      setSelectedGift({
                        id: gift.gift_id,
                        value: gift.gift_value,
                        image: gift.gift_thumbnail,
                      })
                    )
                  }
                  className={`flex flex-col items-center gap-2 p-2 border rounded-lg cursor-pointer transition 
                    ${
                      selectedGiftId === gift.gift_id
                        ? "border-main-green bg-main-green/[0.1]"
                        : "border-main-green/[0.36]"
                    }`}
                >
                  <Image
                    src={gift.gift_thumbnail || "/home/gift.png"}
                    alt={gift.name}
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                  <div className="flex items-center gap-1 background-opacityGradient py-1.5 px-3 rounded-lg">
                    <Image src="/profile/coin.png" alt="coin" width={16} height={16} />
                    <span className="text-xs font-semibold text-dark">{gift.gift_value}</span>
                  </div>
                </div>
              ))
            )}
        </div>

        <div ref={observerRef} className=" mt-2 flex justify-center items-center">
          {isFetchingNextPage && <p>Loading more...</p>}
        </div>

        {selectedGiftId && (
          <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Image src="/profile/coin.png" alt="coin" width={20} height={20} />
              <span className="font-semibold">{total}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(decrementQuantity())}
                className="px-2 py-1 bg-main-green/[0.04] rounded cursor-pointer"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => dispatch(incrementQuantity())}
                className="px-2 py-1 rounded bg-main-green/[0.04] cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              className="bg-main-green text-primary px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1"
              onClick={handleRecharge}
            >
            Send <Image src="/chat/send.png" alt="send" height={20} width={20} />
            </button>
          </div>
        )}
      </div>
    </CustomDialog>
  );
}

export default SendGift;
