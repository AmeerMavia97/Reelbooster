// src/hooks/useGiftCategory.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GiftCategoryRes } from "@/app/types/Gift";
import Cookies from "js-cookie";
import { normalizeMediaUrlsDeep } from "@/app/utils/mediaUrl";

const fetchGiftCategories = async (page: number): Promise<GiftCategoryRes> => {
  const token = Cookies.get("Reelboost_auth_token");

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/gift/get-gift-category`,
    { page }, // page goes in body
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return normalizeMediaUrlsDeep(data);
};

export const useGiftCategories = (page: number) => {
  return useQuery<GiftCategoryRes>({
    queryKey: ["giftCategories", page],
    queryFn: () => fetchGiftCategories(page),
    // keepPreviousData: true, // prevents flicker when switching pages
    staleTime: 1000 * 60, // cache for 1 min
  });
};
