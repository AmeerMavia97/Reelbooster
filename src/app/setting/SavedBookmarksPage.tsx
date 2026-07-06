"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { fetchSavedList } from "@/app/store/api/getSavesList";
import { SavedList, SaveListRecord } from "@/app/types/ResTypes";
import { toast } from "react-toastify";
import useApiPost from "../hooks/postData";
import Cookies from "js-cookie";
import { ClipLoader } from "react-spinners";
import { useAppDispatch } from "../utils/hooks";
import { setSelectedReel } from "../store/Slice/SelectedReelDetail";
import {
  setActiveCommentPostId,
  setActiveUserId,
} from "../store/Slice/ActiveCommentBox";
import ReelDetailsModal from "../explore/SelectedReelModal";
import { Reel, ReelMusic, ReelUser } from "../types/Reels";

export interface ReelRec {
  reel_thumbnail: string;
  social_id: number;
  social_desc: string;
  social_type: string;
  aspect_ratio?: string | null;
  video_hight?: string | null;
  location?: string;
  total_views?: number;
  total_saves?: number;
  total_shares?: number;
  country?: string;
  status?: boolean;
  deleted_by_user?: boolean;
  hashtag?: string[];
  createdAt?: string;
  updatedAt?: string;
  music_id?: number | null;
  user_id: number;
  Media?: string[];
  Music?: ReelMusic | null;
  User: ReelUser;
  total_comments?: number;
  total_likes?: number;
  isFollowing?: boolean;
  isLiked?: boolean;
  isSaved?: boolean;
}



export default function SavedBookmarksPage() {
  const myUserId = Cookies.get("Reelboost_user_id"); // Replace with logged-in user ID
  const observerRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const { postData } = useApiPost();
  const dispatch = useAppDispatch();

  // Saved list (infinite)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["savedList", myUserId],
      queryFn: ({ pageParam }) => fetchSavedList({ pageParam, myUserId: Number(myUserId) || 0 }),
      getNextPageParam: (lastPage) => {
        const pagination = lastPage?.data?.Pagination;
        if (!pagination) return undefined; // no more pages / empty response

        const { current_page, total_pages } = pagination;
        return current_page < total_pages ? current_page + 1 : undefined;
      },

      initialPageParam: 1,
    });

  // Infinite scroll trigger
  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const savedRecords: SaveListRecord[] =
    data?.pages.flatMap((p) => p.data.Records) ?? [];

  // ✅ Optimistic Unsave (no re-fetch to avoid adding back)
  const unsaveMutation = useMutation({
    mutationFn: async (socialId: number) =>
      postData("/save/save-unsave", { social_id: socialId }),

    // Optimistically remove from cache
    onMutate: async (socialId: number) => {
      await queryClient.cancelQueries({ queryKey: ["savedList", myUserId] });
      const previous = queryClient.getQueryData<
        InfiniteData<SavedList, number>
      >(["savedList", myUserId]);

      queryClient.setQueryData(
        ["savedList", myUserId],
        (oldData: InfiniteData<SavedList, number> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                Records: page.data.Records.filter(
                  (r) => r.social_id !== socialId
                ),
              },
            })),
          };
        }
      );

      return { previous };
    },

    // Rollback on error
    onError: (_err, _socialId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["savedList", myUserId], ctx.previous);
      }
      toast.error("Couldn't remove from saved. Restored.");
    },

    // Success toast only (don’t re-fetch)
    onSuccess: (res) => {
      if (res?.status) {
        toast.success(res?.message || "Removed from saved");
      } else {
        toast.error(res?.message || "Failed to remove");
      }
    },
  });

  const handleRemoveBookmark = (socialId: number) => {
    unsaveMutation.mutate(socialId);
  };

  const handleOpenMedia = (record: SaveListRecord) => {
    if (record.Social.social_type === "video") {
      // open your player
    } else {
      // open your images viewer
    }
  };

  return (
    <>
      <h3 className="text-dark font-semibold text-lg px-4 sm:block hidden">
        Saved Bookmark
      </h3>

      {savedRecords.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:pt-4 p-4">
            {savedRecords.map((record) => {
              const mediaUrl = record.Social.Media[0]?.media_location ?? null;
              return (
                <div
                  key={record.social_id}
                  className="relative cursor-pointer w-full rounded-lg overflow-hidden"
                >
                  {mediaUrl ? (
                    <>
                      <video
                        src={mediaUrl}
                        className="h-full w-full object-contain"
                        onClick={() => handleOpenMedia(record)}
                      />

                      {/* Pause Icon Overlay */}
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        onClick={() => {
                         dispatch(setSelectedReel(record.Social as unknown as Reel));

                          dispatch(
                            setActiveCommentPostId(record.Social.social_id)
                          );
                          dispatch(setActiveUserId(record.Social.user_id));
                        }}
                      >
                        <div className=" w-14 h-14 flex justify-center items-center bg-dark/[0.5] backdrop-blur-md rounded-full">
                          <Image
                            src="/chat/play.png" // change to your pause icon path
                            alt="Pause"
                            height={25}
                            width={25}
                            className="opacity-80"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span>No Media</span>
                    </div>
                  )}

                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleRemoveBookmark(record.social_id)}
                    className="absolute top-3 right-3"
                    aria-label="Unsave"
                  >
                    <Image
                      src="/home/filled_bookmark.png"
                      alt="saved"
                      height={24}
                      width={24}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Infinite Scroll Trigger */}
          <div ref={observerRef} className="py-4 text-center">
            {isFetchingNextPage && (
              <span>
                <ClipLoader color="#1A9D77" size={20} />
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center py-56">
          <Image
            src="/Setting/NoBookmarks.png"
            alt="No bookmarks available"
            className=" object-contain"
            height={80}
            width={80}
          />
          <p className="text-sm font-normal text-dark">No Bookmarks Yet</p>
          <p className="text-gray text-sm">
            No bookmarks yet-start saving your favorites
          </p>
        </div>
      )}
      <ReelDetailsModal setReels={function (value: React.SetStateAction<Reel[]>): void {
        throw new Error("Function not implemented.");
      } } />
    </>
  );
}
