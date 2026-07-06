"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import {
  setGifts,
  appendGifts,
  setPagination,
  setLoading,
  resetGifts,
} from "@/app/store/Slice/UserGiftsSlice";
import SkeletonReelCard from "@/app/components/Shimmer/SkeletonReelCard";
import useApiPost from "@/app/hooks/postData";
import { RecievedGiftRes } from "@/app/types/Gift";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

function HosterGifts() {
  const { postData } = useApiPost();
  const dispatch = useAppDispatch();
  const { reels, loading } = useAppSelector(
    (state) => state.userGifts
  );


  const selectedUserId =
    useAppSelector(
      (s) =>
        (s.viewStreaming.response?.data?.Records?.[0] as any)?.Live_hosts?.[0]?.User?.user_id) || {};

  const fetchGifts = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const res: RecievedGiftRes = await postData("/transaction/history", {
        page,
        reciever_id: Number(selectedUserId),
        transaction_table: "coin",
        profile_data: true,
      });

      if (res?.status === true) {
        const newRecords = res.data.Records || [];

        if (page === 1) {
          dispatch(setGifts(newRecords));
        } else {
          dispatch(appendGifts(newRecords));
        }

        dispatch(setPagination(res.data.Pagination));

        // if (onTotalChange) {
        //   onTotalChange(res.data.Pagination.total_records || 0);
        // }
      }
    } catch (error) {
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      dispatch(resetGifts());
      fetchGifts(1);
    }
  }, [selectedUserId]);

  return (
    <>
      <div className=" px-4">
        {loading && reels.length === 0 ? (
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonReelCard key={idx} />
            ))}
          </div>
        ) : reels.length > 0 ? (
          <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 max-w-5xl">
            {reels.map((gift, idx) => (
              <div
                key={`${gift.gift_id}-${idx}`}
                className="flex flex-col gap-3 justify-center border h-[180px] border-main-green/[0.36] place-items-center rounded-2xl"
              >
                <Image
                  src={gift.Gift.gift_thumbnail}
                  alt="gift"
                  width={100}
                  height={100}
                />
                <div className="rounded-2xl background-opacityGradient flex place-items-center gap-3 px-3 py-1.5">
                  <Image
                    src="/profile/coin.png"
                    alt="coin"
                    width={20}
                    height={20}
                  />
                  <p className="font-medium text-[12px] text-dark">
                    {gift.gift_value}
                  </p>
                </div>
              </div>
            ))}

            {/* Pagination load shimmer */}
            {loading &&
              Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonReelCard key={`load-more-${idx}`} />
              ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-1 py-32">
            <Image
              src="/profile/NoGift.png"
              alt="no gift"
              width={100}
              height={100}
            />
            <p className="text-[11px] font-normal text-dark">No Gifts Found.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default HosterGifts;
