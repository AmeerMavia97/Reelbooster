// store/api/fetchSavedList.ts
import axios from "axios";
import Cookies from "js-cookie";
import { SavedList } from "@/app/types/ResTypes";
import { normalizeMediaUrlsDeep } from "@/app/utils/mediaUrl";

export const fetchSavedList = async ({
  pageParam = 1,
  myUserId,
}: {
  pageParam?: number;
  myUserId: number;
}): Promise<SavedList> => {
  const token = Cookies.get("Reelboost_auth_token");

  const { data } = await axios.post<SavedList>(
    `https://api.yeteneksat.com/api/save/saved-list`,
    {
      save_by:myUserId,
      include: "Social",
      page: pageParam,
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
