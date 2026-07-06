// store/api/getCommentList.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CommentList, Record, Pagination } from "@/app/types/CommentRes";
import Cookies from "js-cookie";
import { normalizeMediaUrlsDeep } from "@/app/utils/mediaUrl";

type CommentRequestPayload = {
  social_id: number;
  include: "User";
  page: number;
  comment_ref_id?: number;
};

export interface CommentQueryResult {
  comments: Record[];
  pagination: Pagination;
}

export const useCommentList = (
  socialId: number,
  page: number,
  comment_ref_id?: number
) => {
  return useQuery<CommentQueryResult, Error>({
    queryKey: [
      "comments",
      socialId,
      page,
      comment_ref_id && comment_ref_id > 0 ? comment_ref_id : "no-ref",
    ],
    queryFn: async () => {
      const token = Cookies.get("Reelboost_auth_token");
      if (!token) throw new Error("Auth token not found");

      const requestBody: CommentRequestPayload = {
        social_id: socialId,
        include: "User",
        page,
        ...(comment_ref_id ? { comment_ref_id } : {}),
      };

      const { data } = await axios.post<CommentList>(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/show-comment`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        comments: normalizeMediaUrlsDeep(data?.data?.Records || []),
        pagination: data?.data?.pagination,
      };
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
};
