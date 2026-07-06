"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSavedList } from "@/app/store/api/getSavesList";
import { SaveListRecord } from "@/app/types/ResTypes";
import { toast } from "react-toastify";

export default function SavedBookmarksPage() {
  const myUserId = 123; // Replace with logged-in user ID
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["savedList", myUserId],
    queryFn: ({ pageParam }) => fetchSavedList({ pageParam, myUserId }),
    getNextPageParam: (lastPage) => {
      const { current_page, total_pages } = lastPage.data.Pagination;
      return current_page < total_pages ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const savedRecords: SaveListRecord[] =
    data?.pages.flatMap((p) => p.data.Records) ?? [];

  const handleRemoveBookmark = (socialId: number) => {
    toast.success(`Bookmark removed for social ID ${socialId}`);
    // TODO: call remove API & optimistically update UI
  };

  const handleOpenMedia = (record: SaveListRecord) => {
    if (record.Social.social_type === "video") {
      toast.info(`Play video: ${record.Social.Media[0]?.media_location}`);
    } else {
      toast.info(`Open images viewer for Social ID ${record.social_id}`);
    }
  };

  return (
    <>
      {savedRecords.length > 0 ? (
        <>
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-2 py-4 lg:px-6 px-2">
            {savedRecords.map((record) => {
              const mediaUrl = record.Social.Media[0]?.media_location ?? null;
              return (
                <div
                  key={record.social_id}
                  className="relative cursor-pointer sm:w-[250px] md:w-[220px] sm:h-[350px] h-[300px] lg:h-[300px]"
                >
                  {mediaUrl ? (
                    <video
                      src={mediaUrl}
                    //   alt={record.Social.social_desc || "media"}
                      className="w-full h-full object-cover"
                      onClick={() => handleOpenMedia(record)}
                      
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span>No Media</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleRemoveBookmark(record.social_id)}
                  >
                    <Image
                      src="/assets/filled_save.png"
                      alt="saved"
                      height={21}
                      width={21}
                      className="absolute top-4 right-4"
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Infinite Scroll Trigger */}
          <div ref={observerRef} className="py-4 text-center">
            {isFetchingNextPage && <span>Loading more...</span>}
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center py-80 px-80">
          <Image
            src="/Setting/NoBookmarks.png"
            alt="No bookmarks available"
            className="min-w-60 min-h-60 h-60 object-contain"
            height={1000}
            width={1000}
          />
        </div>
      )}
    </>
  );
}
