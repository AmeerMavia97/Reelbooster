import axios from "axios";
import Cookies from "js-cookie";
import { BlockedList } from "@/app/types/ResTypes";
import { normalizeMediaUrlsDeep } from "@/app/utils/mediaUrl";

interface FetchBlockedUsersParams {
  pageParam?: number;
}

export const fetchBlockedUsers = async ({
  pageParam = 1,
}: FetchBlockedUsersParams): Promise<BlockedList> => {
  const token = Cookies.get("Reelboost_auth_token");

  const { data } = await axios.post<BlockedList>(
    `${process.env.NEXT_PUBLIC_API_URL}/block/block-list`,
    { page: pageParam }, // ✅ send page in body
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return normalizeMediaUrlsDeep(data);
};
