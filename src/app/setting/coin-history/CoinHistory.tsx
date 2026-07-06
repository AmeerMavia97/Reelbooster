"use client";
import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useCoinHistory } from "@/app/store/api/getCoinHistory";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import DateRangePicker from "@/app/components/DatePicker";
import { setDateRange } from "@/app/store/Slice/DateRangeSlice";
import { setUserId } from "@/app/store/Slice/UserIdHashtagIdSlice";
import { useRouter } from "next/navigation";

// Shimmer component
function CoinHistoryShimmer() {
  return (
    <div className="animate-pulse space-y-3 px-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="border p-3 rounded-xl flex justify-between items-center"
        >
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-md" />
            <div className="space-y-2">
              <div className="w-32 h-3 bg-gray-200 rounded" />
              <div className="w-24 h-3 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="w-10 h-5 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

function CoinHistoryPage() {
  const { startDate, endDate } = useAppSelector((state) => state.dateRange);
  const router = useRouter();
  // ✅ Only build params if dates exist
  const start =
    startDate !== null
      ? new Date(startDate).toISOString().split("T")[0]
      : undefined;
  const end =
    endDate !== null
      ? new Date(endDate).toISOString().split("T")[0]
      : undefined;
  const dispatch = useAppDispatch();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useCoinHistory(start, end);
  // fetch the data as per dates seleted

  const [isAtBottom, setIsAtBottom] = useState(false);

  // scroll event listener for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;

      setIsAtBottom(bottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Trigger next page fetch when reaching bottom
  useEffect(() => {
    if (isAtBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isAtBottom, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <CoinHistoryShimmer />;

  const allRecords = data?.pages.flatMap((page) => page.data.Records) || [];

  const handleUserRoute = (userId: number) => {
    dispatch(setUserId(userId));
    router.push(`/profile/${userId}`);
  };

  // if (!isLoading && allRecords.length === 0) {
  //   return (
  //     <div className="flex flex-col justify-center items-center py-56">
  //       <Image
  //         src="/gift/NoCoinHistory.png"
  //         alt="No coin history available"
  //         className=" object-contain"
  //         height={80}
  //         width={80}
  //       />
  //       <p className="text-sm font-normal text-dark">Coin History Not Found</p>
  //       <p className="text-gray text-sm">
  //         You don’t have any coin transactions yet.
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-2">
      <div className="flex justify-between place-items-center px-6">
        <h2 className="pb-4 pt-6 text-dark font-semibold text-lg">
          Coin History
        </h2>

        <DateRangePicker
          onChange={(range) => {
            if (range?.startDate && range?.endDate) {
              dispatch(setDateRange(range));
            }
          }}
        />
      </div>

      {!isLoading && allRecords.length === 0 ? (
        <>
          <div className="flex flex-col justify-center items-center py-56">
            <Image
              src="/gift/NoCoinHistory.png"
              alt="No coin history available"
              className=" object-contain"
              height={80}
              width={80}
            />
            <p className="text-sm font-normal text-dark">
              Coin History Not Found
            </p>
            <p className="text-gray text-sm">
              You don’t have any coin transactions yet.
            </p>
          </div>
        </>
      ) : (
        <>
          {allRecords.map((record) => {
            const isSent =
              String(record.sender_id) === Cookies.get("Reelboost_user_id");
            return (
              <div
                key={record.transaction_id}
                className={`border p-3 rounded-xl flex justify-between mx-6 ${
                  isSent ? "border-[#FFC9C9]" : "border-[#C7EAD0]"
                }`}
              >
                {/* sender/receiver details */}
                <div className="flex gap-3 items-center">
                  <Image
                    src="/gift/giftBox.png"
                    alt="gift"
                    width={45}
                    height={45}
                  />
                  <div className="flex flex-col gap-1">
                    <p
                      className="text-dark font-semibold text-sm cursor-pointer"
                      onClick={() =>
                        handleUserRoute(
                          isSent ? record.reciever_id : record.sender_id
                        )
                      }
                    >
                      {isSent ? (
                        <>
                          <span className="font-medium text-dark">
                            You sent a gift to{" "}
                          </span>
                          {record.reciever?.user_name}
                        </>
                      ) : (
                        <>
                          {record.sender?.user_name}{" "}
                          <span className="font-medium text-dark">
                            sent a gift
                          </span>
                        </>
                      )}
                    </p>
                    <div className="flex gap-2 items-center">
                      <Image
                        src={
                          isSent ? "/gift/withdrawn.png" : "/gift/received.png"
                        }
                        alt=""
                        width={15}
                        height={15}
                      />
                      <p className="text-xs text-gray">
                        • {new Date(record.createdAt).toLocaleDateString()} •{" "}
                        {new Date(record.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* coins */}
                <div className="flex flex-col gap-1 items-center">
                  <Image
                    src="/profile/coin.png"
                    alt="coin"
                    width={20}
                    height={20}
                  />
                  <p
                    className={`text-xs ${isSent ? "text-red" : "text-green"}`}
                  >
                    {record.coin} {record.coin > "1" ? "Coins" : "Coin"}
                  </p>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Loader at bottom */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <p className="text-gray-500 text-sm">Loading more...</p>
        </div>
      )}
    </div>
  );
}

export default CoinHistoryPage;
