// store/api/getCommentReply.ts

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Record, CommentList } from '@/app/types/CommentRes';
import { useAppDispatch } from '@/app/utils/hooks';
import { setReplies } from '../Slice/storeCommentsReplies';
import { normalizeMediaUrlsDeep } from '@/app/utils/mediaUrl';

const useReplies = (commentRefId: number, enabled: boolean) => {
  const dispatch = useAppDispatch();

  const fetchReplies = async (): Promise<Record[]> => {
    const token = Cookies.get("Reelboost_auth_token");

    const { data } = await axios.post<CommentList>(
      `https://api.yeteneksat.com/api/comment/show-comment`,
      {
        include: "User",
        page: 1,
        comment_ref_id: commentRefId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const replies = normalizeMediaUrlsDeep(data?.data?.Records || []);
    dispatch(setReplies(replies));
    return replies;
  };

  return useQuery<Record[], Error>({
    queryKey: ['replies', commentRefId],
    queryFn: fetchReplies,
    enabled,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export { useReplies };
