// src/hooks/useReceivedGifts.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { RecievedGiftRes } from "@/app/types/Gift";
import { normalizeMediaUrlsDeep } from "@/app/utils/mediaUrl";

const fetchReceivedGifts = async ({
  pageParam = 1,
  socialId,
  receiverId,
}: {
  pageParam?: number;
  socialId: number | null;
  receiverId: number | null;
}): Promise<RecievedGiftRes> => {
  const token = Cookies.get("Reelboost_auth_token");

  const { data } = await axios.post(
    `https://api.yeteneksat.com/api/transaction/history`,
    {
      page: pageParam,
      social_id: socialId,
      reciever_id: receiverId,
      transaction_table: "coin",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return normalizeMediaUrlsDeep(data);
};

export const useReceivedGifts = (
  socialId: number | null,
  receiverId: number | null
) => {
  return useInfiniteQuery<RecievedGiftRes>({
    queryKey: ["received-gifts", socialId, receiverId],
    queryFn: ({ pageParam }) =>
      //@ts-ignore
      fetchReceivedGifts({ pageParam, socialId, receiverId }),
    enabled: !!socialId && !!receiverId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { Pagination } = lastPage.data;
      if (Pagination.current_page < Pagination.total_pages) {
        return Pagination.current_page + 1;
      }
      return undefined;
    },
  });
};
