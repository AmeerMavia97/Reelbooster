// import { LiveList } from "@/app/types/LiveReels";
// import useApiPost from "@/app/hooks/postData";
// import { useAppDispatch } from "@/app/utils/hooks";
// import { setViewStreamingResponse } from "@/app/store/Slice/ViewStreamingSlice";

// export const useLiveIdApi = () => {
//   const { postData } = useApiPost();
//   const dispatch = useAppDispatch();

//   const fetchLive = async (live_id: string): Promise<LiveList> => {
//     const payload = { live_id };

//     const res = await postData("/live/live-list", payload);

//     // ✅ Store in Redux slice
//     dispatch(setViewStreamingResponse(res));

//     return res;
//   };

//   return { fetchLive };
// };



import useApiPost from "@/app/hooks/postData";
import { useAppDispatch } from "@/app/utils/hooks";
import { setViewStreamingResponse } from "@/app/store/Slice/ViewStreamingSlice";
import { ViewstreamingRes } from "@/app/types/ResTypes";

export const useLiveIdApi = () => {
  const { postData } = useApiPost();
  const dispatch = useAppDispatch();

  const fetchLive = async (live_host_id: string):  Promise<ViewstreamingRes> => {
    const payload = { live_host_id };
    const res = await postData("/live/live-list-values", payload);
    // ✅ Store in Redux slice
    dispatch(setViewStreamingResponse(res));

    return res;
  };

  return { fetchLive };
};
