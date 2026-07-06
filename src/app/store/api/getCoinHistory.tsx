import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { CoinHistoryRes } from "@/app/types/Gift";

const fetchCoinHistory = async ({
  pageParam = 1,
  startDate,
  endDate,
}: {
  pageParam?: number;
  startDate?: string | undefined;
  endDate?: string | undefined;
}): Promise<CoinHistoryRes> => {
  const token = Cookies.get("Reelboost_auth_token");
  const MyUserId = Cookies.get("Reelboost_user_id");

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/transaction/history`,
    {
      page: pageParam,
      receiver_id: MyUserId,
      sender_id: MyUserId,
      all: "true",
      transaction_table: "coin",
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

export const useCoinHistory = (
  startDate: string | undefined,
  endDate: string | undefined
) => {
  return useInfiniteQuery<CoinHistoryRes>({
    queryKey: ["coinHistory", startDate, endDate],
    queryFn: ({ pageParam }) =>
      //@ts-ignore
      fetchCoinHistory({ pageParam, startDate, endDate }),
    enabled: true, // 👈 always true unless you want conditional
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { Pagination } = lastPage?.data || {};
      if (!Pagination) return undefined;

      if (Pagination.current_page < Pagination.total_pages) {
        return Pagination.current_page + 1;
      }
      return undefined;
    },
  });
};
