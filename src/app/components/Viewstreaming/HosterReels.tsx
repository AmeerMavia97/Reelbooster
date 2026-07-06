"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { AiOutlineEye } from "react-icons/ai";
import Image from "next/image";
import useApiPost from "@/app/hooks/postData";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";

import {
  setLoading,
  setReels,
  appendReels,
  setPagination,
  resetReels,
} from "@/app/store/Slice/UserReelsSlice";

import { setSelectedReel } from "@/app/store/Slice/SelectedReelDetail";
import {
  setActiveCommentPostId,
  setActiveUserId,
} from "@/app/store/Slice/ActiveCommentBox";

import SkeletonReelCard from "../../components/Shimmer/SkeletonReelCard";
import { SocialMediaResponse } from "@/app/types/Reels";
import ReelDetailsModalHoster from "./ReelDetailsModalHoster";

function HosterReels() {
  const { postData } = useApiPost();
  const dispatch = useAppDispatch();

  const { reels, currentPage, totalPages, loading } = useAppSelector(
    (state) => state.userReels
  );
  const selectedUserId = useAppSelector((state) => state.viewStream.records[0]?.User.user_id)


  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchReels = async (page = 1) => {
    if (!selectedUserId) return;

    try {
      dispatch(setLoading(true));

      const response: SocialMediaResponse = await postData(
        "/social/get-social",
        {
          social_type: "reel",
          page,
          user_id: Number(selectedUserId),
        }
      );

      if (response?.status) {
        const records = response.data.Records || [];

        page === 1
          ? dispatch(setReels(records))
          : dispatch(appendReels(records));

        dispatch(
          setPagination({
            currentPage: response.data.Pagination.current_page,
            totalPages: response.data.Pagination.total_pages,
          })
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  };



  const ISApiCall = useAppSelector((state) => state.ui.isApiCall)


  useEffect(() => {
    if (ISApiCall) {
      fetchReels()
    }
  }, [ISApiCall])

  useEffect(() => {
    if (selectedUserId) {
      dispatch(resetReels());
      fetchReels(1);
    }
  }, [selectedUserId]);

  const loadMore = useCallback(() => {
    if (!loading && currentPage < totalPages) {
      fetchReels(currentPage + 1);
    }
  }, [loading, currentPage, totalPages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && loadMore(),
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className="px-4">
        {reels.length ? (
          <>
            <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-4">
              {reels.map((item) => (
                <div key={item.social_id}>
                  <div className="relative h-[250px] bg-black rounded-lg overflow-hidden">
                    <video
                      src={item?.Media?.[0]?.media_location}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => {
                        dispatch(setSelectedReel(item as any)); 
                        dispatch(setActiveCommentPostId(item.social_id));
                        dispatch(setActiveUserId(item.User.user_id));
                      }}
                    />

                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white">
                      <AiOutlineEye />
                      <span className="text-xs">{item.total_views}</span>
                    </div>
                  </div>
                </div>
              ))}

              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonReelCard key={i} />
                ))}
            </div>

            <div ref={observerRef} className="h-10" />
          </>
        ) : !loading ? (
          <div className="flex flex-col items-center py-32">
            <Image
              src="/profile/NoReels.png"
              alt="no reels"
              width={100}
              height={100}
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonReelCard key={i} />
            ))}
          </div>
        )}
      </div>

      {/* ✅ NO PROPS */}
      <ReelDetailsModalHoster />
    </>
  );
}

export default HosterReels;
