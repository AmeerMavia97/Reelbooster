// store/api/getPaymentHistory.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { PaymentHistoryRes } from "@/app/types/Gift";

// store/api/getPaymentHistory.ts
const fetchPaymentHistory = async ({
  pageParam = 1,
  transactionType,
  startDate,
  endDate,
}: {
  pageParam?: number;
  transactionType: string;
  startDate?: string | null;
  endDate?: string | null;
}): Promise<PaymentHistoryRes> => {
  const token = Cookies.get("Reelboost_auth_token");

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/transaction/history`,
    {
      page: pageParam,
      transaction_table: "money",
      transaction_type: transactionType,
      start_date: startDate,
      end_date: endDate,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};

export const usePaymentHistory = (
  transactionType: string,
  startDate?: string | null,
  endDate?: string | null
) => {
  return useInfiniteQuery<PaymentHistoryRes>({
    queryKey: ["paymentHistory", transactionType, startDate, endDate], // ✅ include in key so it refetches when date changes
    queryFn: ({ pageParam }) =>
      //@ts-ignore
      fetchPaymentHistory({ pageParam, transactionType, startDate, endDate }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { Pagination } = lastPage?.data || {};
      if (!Pagination) return undefined;
      return Pagination.current_page < Pagination.total_pages
        ? Pagination.current_page + 1
        : undefined;
    },
  });
};

