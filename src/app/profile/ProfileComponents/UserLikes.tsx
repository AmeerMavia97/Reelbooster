"use client";
import React, { useEffect, useRef, useCallback } from "react";
import useApiPost from "@/app/hooks/postData";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import {
  setLikes,
  appendLikes,
  setPagination,
  setLoading,
  resetLikes,
} from "@/app/store/Slice/UserLikesSlice";
import SkeletonReelCard from "@/app/components/Shimmer/SkeletonReelCard";
import Cookies from "js-cookie";
import { LikeListRes } from "@/app/types/ResTypes";
import { usePathname } from "next/navigation";

function UserLikes() {
  const { postData } = useApiPost();
  const dispatch = useAppDispatch();
  const { reels, pagination, loading } = useAppSelector(
    (state) => state.userLikes
  );
  const MyUserId = Cookies.get("Reelboost_user_id");
  const observerRef = useRef<HTMLDivElement | null>(null);
  const selectedUserId = useAppSelector((state) => state.userId.user_id);
  const pathname = usePathname();

  const fetchLikes = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const res: LikeListRes = await postData("/like/like-list", {
        include: "Social",
        like_by:
          pathname === "/profile" ? Number(MyUserId) : Number(selectedUserId),

        page: page,
      });

      if (res?.status === true) {
        const newRecords = res.data.Records || [];
        if (page === 1) {
          dispatch(setLikes(newRecords));
        } else {
          dispatch(appendLikes(newRecords));
        }

        dispatch(setPagination(res.data.Pagination));

        // if (onTotalChange) {
        //   onTotalChange(res.data.Pagination.total_records || 0);
        // }
      }
    } catch (error) {
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Initial fetch
  useEffect(() => {
    if (selectedUserId || MyUserId) {
      dispatch(resetLikes());
      fetchLikes(1);
    }
  }, [selectedUserId, MyUserId]);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        !loading && pagination &&
        pagination?.current_page < pagination?.total_pages
      ) {
        fetchLikes(pagination?.current_page + 1);
      }
    },
    [loading, pagination]
  );

  useEffect(() => {
    const option = { root: null, rootMargin: "20px", threshold: 0.5 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  return (
    <>
      {loading && reels.length === 0 ? (
        // Initial load shimmer
        <div className="grid 2xl:grid-cols-6 xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-4">
          {Array.from({ length: 12 }).map((_, idx) => (
            <SkeletonReelCard key={idx} />
          ))}
        </div>
      ) : reels?.length > 0 ? (
        <div className="grid 2xl:grid-cols-6 xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-4">
          {reels.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="relative rounded-lg overflow-hidden h-[250px] bg-dark">
                <video
                  src={item.Social.Media[0].media_location}
                  className="h-full w-full object-cover"
                  playsInline
                  autoPlay
                  muted
                  loop
                />
                <div className="flex gap-1 place-items-center absolute bottom-2 left-2 text-primary">
                  <Image
                    src="/ReelBoost/borderHeart.png"
                    alt="heart"
                    height={10}
                    width={10}
                  />
                  <p className="text-primary font-medium text-xs">
                    {item.total_likes}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Loader for pagination */}
          {loading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonReelCard key={`load-more-${idx}`} />
            ))}

          {/* Invisible observer div for infinite scroll */}
          <div ref={observerRef} className="h-10 w-full"></div>
        </div>
      ) : (
        <div className="flex flex-col justify-center place-items-center py-32">
          <Image
            src="/profile/NoLiked.png"
            alt="verified"
            height={100}
            width={100}
          />
          <p className="text-[11px] font-normal text-dark">
            No Liked Videos Yet.
          </p>
        </div>
      )}
    </>
  );
}

export default UserLikes;
