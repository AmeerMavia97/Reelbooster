"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { AiOutlineEye } from "react-icons/ai";
import useApiPost from "@/app/hooks/postData";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import {
  setLoading,
  setReels,
  appendReels,
  setPagination,
  resetReels,
} from "@/app/store/Slice/UserReelsSlice";
import { setSelectedReel } from "@/app/store/Slice/SelectedReelDetail";
import { setActiveCommentPostId, setActiveUserId } from "@/app/store/Slice/ActiveCommentBox";
import ReelDetailsModal from "@/app/explore/SelectedReelModal";
// Update the import path to the correct location of SkeletonReelCard
import SkeletonReelCard from "../../components/Shimmer/SkeletonReelCard"; // shimmer
import { Reel, SocialMediaResponse } from "@/app/types/Reels";
import Cookies from 'js-cookie'
import { usePathname } from "next/navigation";


function UserReels() {
  const { postData } = useApiPost();
  const dispatch = useAppDispatch();
  const { reels, currentPage, totalPages, loading } = useAppSelector(
    (state) => state.userReels
  );
  const selectedUserId = useAppSelector((state) => state.userId.user_id);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const MyUserId = Cookies.get("Reelboost_user_id")
  const pathname = usePathname();


const fetchReels = async (page = 1) => {
  try {
    dispatch(setLoading(true));
    const response: SocialMediaResponse = await postData("/social/get-social", {
      social_type: "reel",
      page,
      user_id: (pathname === "/profile" ? Number(MyUserId) : Number(selectedUserId)),
    });

    if (response?.status) {
      const newRecords = response.data.Records || [];
      if (page === 1) {
        dispatch(setReels(newRecords));
      } else {
        dispatch(appendReels(newRecords));
      }

      dispatch(
        setPagination({
          currentPage: response.data.Pagination.current_page,
          totalPages: response.data.Pagination.total_pages,
        })
      );
    }
  } catch (error) {
  } finally {
    dispatch(setLoading(false));
  }
};


  // Initial fetch
  useEffect(() => {
    if (selectedUserId || MyUserId) {
      dispatch(resetReels());
      fetchReels(1);
    }
  }, [selectedUserId,MyUserId]);

  // Infinite scroll observer
  const loadMore = useCallback(() => {
    if (!loading && currentPage < totalPages) {
      fetchReels(currentPage + 1);
    }
  }, [loading, currentPage, totalPages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loadMore]);

  return (
    <>
      <div>
        {reels?.length > 0 ? (
          <>
            <div className="grid 2xl:grid-cols-6 xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-4">
              {reels.map((item) => (
                <div key={item.social_id} className="flex flex-col gap-1">
                  <div className="relative rounded-lg overflow-hidden h-[250px] bg-black">
                    <video
                      src={item?.Media?.[0]?.media_location}
                      className="h-full w-full object-cover cursor-pointer"
                      playsInline
                      autoPlay
                      muted
                      loop
                      onClick={() => {
                        //@ts-ignore
                        dispatch(setSelectedReel(item));
                        dispatch(setActiveCommentPostId(item.social_id));
                        dispatch(setActiveUserId(item.User.user_id));
                      }}
                    />
                    <div className="absolute bottom-0 left-0 w-full h-[70px] bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                    <div className="flex gap-1 place-items-center absolute bottom-2 left-2 z-20 text-white">
                      <AiOutlineEye />
                      <p className="text-primary font-medium text-xs">{item.total_views}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Shimmer loader when fetching */}
              {loading &&
                Array.from({ length: 6 }).map((_, idx) => <SkeletonReelCard key={idx} />)}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerRef} className="h-10" />
          </>
        ) : !loading ? (
          <div className="flex flex-col justify-center items-center gap-2 py-32">
            <Image src="/profile/NoReels.png" alt="no reels" width={100} height={100} />
          </div>
        ) : (
          <div className="grid 2xl:grid-cols-6 xl:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-4">
            {Array.from({ length: 12 }).map((_, idx) => (
              <SkeletonReelCard key={idx} />
            ))}
          </div>
        )}
      </div>

      <ReelDetailsModal setReels={function (value: React.SetStateAction<Reel[]>): void {
        throw new Error("");
      } } />
    </>
  );
}

export default UserReels;
