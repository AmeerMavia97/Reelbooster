
import { LiveList } from "@/app/types/LiveReels";
import useApiPost from "@/app/hooks/postData";

// custom fetch function for live reels
export const useLiveApi = () => {
  const { postData } = useApiPost();

  const fetchLive = async (page: number): Promise<LiveList> => {
    const payload = {
      social_type: "reel",
      page,
    };
    return await postData("/live/live-list", payload);
  };

  return { fetchLive };
};
