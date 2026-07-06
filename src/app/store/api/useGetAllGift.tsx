import useApiPost from "@/app/hooks/postData";
import { GiftResponceAll } from "@/app/types/ResTypes";

export const useGetAllGift = () => {
  const { postData } = useApiPost();

  const fetchLive = async (all: boolean): Promise<GiftResponceAll> => {
    // Set the payload explicitly with all: true or all: false based on the argument passed
    const payload = { all: true }; // You can replace `true` with `all` if you want it dynamic

    const res = await postData("/gift/get-gift", payload);

    return res;
  };

  return { fetchLive };
};
