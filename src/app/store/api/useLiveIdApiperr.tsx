


import useApiPost from "@/app/hooks/postData";
import { useAppDispatch } from "@/app/utils/hooks";
import { setViewStreamingResponse } from "@/app/store/Slice/ViewStreamingSlice";
import { ViewstreamingRes } from "@/app/types/ResTypes";

export const useLiveIdApiperr = () => {
  const { postData } = useApiPost();
  const dispatch = useAppDispatch();

  const fetchLive = async (peer_id: string):  Promise<ViewstreamingRes> => {
    const payload = { peer_id };
    const res = await postData("/live/live-list-values", payload);
    // ✅ Store in Redux slice
    dispatch(setViewStreamingResponse(res));

    return res;
  };

  return { fetchLive };
};