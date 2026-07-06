"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePaymentHistory } from "@/app/store/api/getPaymentHistory";
import { ClipLoader } from "react-spinners";
import { useAppSelector } from "@/app/utils/hooks";

type WithdrawHistoryProps = {
  limit?: number;
};

function WithdrawHistory({ limit }: WithdrawHistoryProps) {
  const { startDate, endDate } = useAppSelector((state) => state.dateRange);

  // ✅ Only build params if dates exist
  const start =
    startDate !== null
      ? new Date(startDate).toISOString().split("T")[0]
      : undefined;
  const end =
    endDate !== null
      ? new Date(endDate).toISOString().split("T")[0]
      : undefined;

  // ✅ Pass only the params that exist
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePaymentHistory("withdrawal", start, end);

  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    if (limit) return;
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;
      setIsAtBottom(bottom);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [limit]);

  useEffect(() => {
    if (!limit && isAtBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [limit, isAtBottom, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-8">
        <ClipLoader size={10} color="#1A9D77" />
      </div>
    );

  const allRecords = data?.pages.flatMap((page) => page.data.Records) || [];
  const displayedRecords = limit ? allRecords.slice(0, limit) : allRecords;

  if (displayedRecords.length === 0)
    return (
      <div className="flex flex-col justify-center items-center py-8">
        <Image
          src="/gift/NoWithdrawHistory.png"
          alt="No withdraw available"
          className="object-contain"
          height={80}
          width={80}
        />
        <p className="text-sm font-normal text-dark">No Withdraw History</p>
        <p className="text-gray text-xs sm:text-sm">
          Start transacting to track your withdrawals.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      {displayedRecords.map((item) => (
        <div
          key={item?.transaction_id}
          className="flex items-center justify-between border border-[#FFC9C9] rounded-lg px-3 py-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFC9C9] flex items-center justify-center">
              <Image src="/gift/withdrawn.png" alt="withdraw" width={15} height={15} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-dark text-xs font-medium">Withdrawal payment</p>
              <p className="text-gray text-xs">
                • {new Date(item?.createdAt).toLocaleDateString()} •{" "}
                {new Date(item?.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-red text-end">
              -${item?.acutal_money}
            </p>
            <div
              className={`${
                item?.success === "rejected"
                  ? "bg-red text-primary"
                  : item?.success === "pending"
                  ? "bg-yellow-400 text-dark"
                  : "bg-main-green text-primary"
              } text-xs px-3 py-0.5 rounded-3xl`}
            >
              {item?.success}
            </div>
          </div>
        </div>
      ))}

      {!limit && isFetchingNextPage && (
        <p className="text-center text-xs text-gray-500 py-2">
          <ClipLoader size={15} color="#1A9D77" />
        </p>
      )}
    </div>
  );
}

export default WithdrawHistory;
