"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { hideModal } from "../store/Slice/ModalsSlice";
import CustomDialog from "../components/CustomDialog";
import { useReceivedGifts } from "../store/api/getReceivedGifts";
import { ClipLoader } from "react-spinners";

function MyGifts() {
  const open = useAppSelector((state) => state.modals.MyGifts);
  const socialId = useAppSelector((state) => state.selectedReel.ReelId);
  const receiverId = useAppSelector((state) => state.userId.user_id);
  const dispatch = useAppDispatch();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useReceivedGifts(socialId, receiverId);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchNextPage, hasNextPage]);

  const allGifts = data?.pages.flatMap((page) => page.data.Records) || [];

  return (
    <CustomDialog
      open={open}
      onClose={() => dispatch(hideModal("MyGifts"))}
      width="420px"
      title="Gift Received"
    >
      <div className="max-h-[65vh] overflow-y-auto">
        {isLoading && <p className="text-center text-gray-500 py-4">Loading...</p>}
        {isError && (
          <p className="text-center text-red-500 py-4">Failed to load gifts.</p>
        )}

        {!isLoading && allGifts.length === 0 && (
          <div className="flex flex-col justify-center items-center gap-1 py-14">
            <Image
              src="/profile/NoGift.png"
              alt="no gift"
              width={100}
              height={100}
            />
            <p className="text-sm font-normal text-dark">
              No Gifts Received Yet!!
            </p>
            <p className="text-gray text-sm">Connect and your first gift might just arrive.</p>
          </div>
        )}

        <div className="divide-y divide-gray-300">
          {allGifts.map((gift) => (
            <div
              key={gift.transaction_id}
              className="flex justify-between items-center w-full py-2.5 px-4"
            >
              {/* Sender */}
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={gift.sender?.profile_pic || "/default-avatar.png"}
                    alt="sender"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-sm font-semibold">{gift.sender?.full_name}</h2>
                  <p className="text-xs text-gray-500">{gift.sender?.user_name}</p>
                </div>
              </div>

              {/* Gift */}
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={gift.Gift?.gift_thumbnail || "/default-gift.png"}
                  alt={gift.Gift?.name || "gift"}
                  width={28}
                  height={28}
                  className="object-contain"
                />
                <div className="flex items-center gap-1 bg-main-green/[0.3] py-1 px-3 rounded-full">
                  <Image src="/profile/coin.png" alt="coin" width={12} height={12} />
                  <span className="text-xs font-medium text-dark">{gift.gift_value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Infinite Scroll Loader */}
        <div ref={loaderRef} className="h-4  flex justify-center items-center">
          {isFetchingNextPage && (
            <ClipLoader color="#1A9D77" size={15} />
          )}
        </div>
      </div>
    </CustomDialog>
  );
}

export default MyGifts;
