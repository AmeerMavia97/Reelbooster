// src/hooks/useGifts.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { GetGiftResponse } from "@/app/types/Gift";
import { normalizeMediaUrlsDeep } from "@/app/utils/mediaUrl";

const fetchGifts = async ({
  pageParam = 1,
  categoryId,
}: {
  pageParam?: number;
  categoryId: number | null;
}): Promise<GetGiftResponse> => {
  const token = Cookies.get("Reelboost_auth_token");

  const { data } = await axios.post(
    `https://api.yeteneksat.com/api/gift/get-gift`,
    { page: pageParam, gift_category_id: categoryId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return normalizeMediaUrlsDeep(data);
};

export const useGifts = (categoryId: number | null) => {
  return useInfiniteQuery<GetGiftResponse>({
    queryKey: ["gifts", categoryId],
    //@ts-ignore
    queryFn: ({ pageParam }) => fetchGifts({ pageParam, categoryId }),
    enabled: !!categoryId,
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
