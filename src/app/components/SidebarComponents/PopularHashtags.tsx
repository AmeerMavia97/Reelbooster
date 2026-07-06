import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/utils/hooks";
import { showModal } from "@/app/store/Slice/ModalsSlice";
import Cookies from "js-cookie";
import { setHashtag } from "@/app/store/Slice/UserIdHashtagIdSlice";
import { useRouter } from "next/navigation";
import useApiPost from "@/app/hooks/postData";
import { HashtagRecord, HashtagSocialResponse } from "@/app/types/ResTypes";
import { RiHashtag } from "react-icons/ri";

function PopularHashtags() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = Cookies.get("Reelboost_auth_token");

  const [hashtags, setHashtags] = useState<HashtagRecord[]>([]);
  const { postData, loading } = useApiPost();

  const fetchHashtags = async () => {
    try {
      const response: HashtagSocialResponse = await postData(
        "/hashtag/get-hashtags",
        {
          add_social: "true",
          sort_order: "DESC",
        }
      );
      if (response.status) {
        setHashtags(response.data.Records);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchHashtags();
  }, []);

  const handleHashtagRoute = (hashtagName: string, total: string) => {
    dispatch(
      setHashtag({
         // update this if `hashtag_id` exists in the API response
        hashtag_name: hashtagName,
        count: total,
      })
    );
    router.push("/explore");
  };

  return (
    <div className="px-10 border-t">
      <h2 className=" text-base text-gray pt-4 pb-5">Popular Hashtags</h2>

      {/* Hashtag shimmer or list */}
      {loading ? (
        <div className="animate-pulse">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex gap-2 items-start mb-4">
              <div className="rounded-full border-2 p-2 border-gray-300">
                <RiHashtag className="text-lg text-gray-600" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="w-[100px] h-[8px] bg-gray-300 rounded" />
                <div className="w-[60px] h-[6px] bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        hashtags?.slice(0, 4).map((hashtag) => (
          <div
            key={hashtag.hashtag_name}
            className="flex gap-3 items-start mb-4 cursor-pointer"
            onClick={() => {
              if (!token) {
                dispatch(showModal("Signin"));
              } else {
                handleHashtagRoute(hashtag.hashtag_name, hashtag.total_socials);
              }

            }}
          >
            <div className="rounded-full border-2 p-2 border-gray-200">
              <RiHashtag className="text-lg text-gray-500" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm text-dark font-medium">
                #{hashtag.hashtag_name}
              </h3>
              <p className="text-[11px] font-normal text-gray">
                {hashtag.total_socials} posts
              </p>
            </div>
          </div>
        ))
      )}

      {/* See all button */}
      <button
        className="text-sm text-main-green cursor-pointer hover:underline"
        onClick={() => {
          if (!token) {
            dispatch(showModal("Signin"));
          } else {
            router.push("/explore");
          }
        }}
      >
        See all
      </button>
    </div>
  );
}

export default PopularHashtags;
