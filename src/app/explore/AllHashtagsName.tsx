"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { setHashtag } from "../store/Slice/UserIdHashtagIdSlice";
import useApiPost from "../hooks/postData";
import Cookies from "js-cookie";
import { IoIosArrowBack } from "react-icons/io";

import {
  HashtagRecord,
  HashtagSocialResponse,
  PaginationInfo,
} from "../types/ResTypes";

function AllHashtagsName() {
  const token = Cookies.get("Reelboost_auth_token");
  const dispatch = useAppDispatch();
  const { postData, loading } = useApiPost();

  const [page, setPage] = useState(1);
  const [hashtags, setHashtags] = useState<HashtagRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  const selectedHashtagFromStore = useAppSelector(
    (state) => state.userId.hashtag_name
  );
  const [selectedHashtag, setSelectedHashtag] = useState<string>(
    selectedHashtagFromStore || "All"
  );

  const itemsToShow = 10;
  const fetchedPages = useRef<Set<number>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  const fetchHashtags = async (pageNum: number) => {
    if (loading || fetchedPages.current.has(pageNum)) return;
    fetchedPages.current.add(pageNum);

    try {
      const response: HashtagSocialResponse = await postData(
        "/hashtag/get-hashtags",
        {
          token,
          page: pageNum,
          pageSize: 5000,
          add_social: true,
        }
      );

      if (response.status) {
        setHashtags((prev) => [...prev, ...response.data.Records]);
        setPagination(response.data.Pagination);
      }
    } catch (error) {
    }
  };

  // Initial load
 // Initial load
// Initial load
useEffect(() => {
  fetchHashtags(1);

  if (!selectedHashtagFromStore) {
    dispatch(setHashtag({ hashtag_name: "All", count: "0" }));
  }
}, []);

// Sync local state with Redux
useEffect(() => {
  if (selectedHashtagFromStore) {
    setSelectedHashtag(selectedHashtagFromStore);
  }
}, [selectedHashtagFromStore]);



  // Scroll-based fetch
  useEffect(() => {
    const handleScroll = () => {
      const grid = gridRef.current;
      if (!grid || !pagination || loading) return;

      const { scrollLeft, scrollWidth, clientWidth } = grid;
      const scrollThreshold = 100;

      if (scrollWidth - (scrollLeft + clientWidth) < scrollThreshold) {
        if (page < (pagination.total_pages ?? 0)) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchHashtags(nextPage);
        }
      }
    };

    const grid = gridRef.current;
    grid?.addEventListener("scroll", handleScroll);
    return () => grid?.removeEventListener("scroll", handleScroll);
  }, [page, loading, pagination]);

  const handleNext = () => {
    const nextIndex = startIndex + 1;
    if (
      nextIndex + itemsToShow > hashtags.length &&
      pagination &&
      page < pagination.total_pages
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchHashtags(nextPage);
    }

    if (nextIndex < hashtags.length) {
      setStartIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  // Remove selected hashtag from main list
  const filteredHashtags = hashtags.filter(
    (h) => h.hashtag_name !== selectedHashtag
  );

  return (
    <div className="relative py-4 max-w-xs sm:max-w-xl mx-auto xl:max-w-full">
      {/* Left Arrow */}
      {startIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute md:-left-12 left-0 top-1/2 -translate-y-1/2 z-10 bg-primary shadow p-2 rounded-full"
        >
          <IoIosArrowBack className="text-dark text-base" />
        </button>
      )}

      {/* Right Arrow */}
      {(startIndex + itemsToShow < filteredHashtags.length ||
        (pagination && page < pagination.total_pages)) && (
        <button
          onClick={handleNext}
          className="absolute md:-right-12 right-0 top-1/2 -translate-y-1/2 z-10 bg-primary shadow p-2 rounded-full"
        >
          <IoIosArrowBack className="text-base text-dark rotate-180" />
        </button>
      )}

      {/* Hashtag Pills */}
      <div
        ref={gridRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide"
        style={{ maxHeight: "60px" }}
      >
        {/* All Button */}
        <button
          onClick={() => {
            setSelectedHashtag("All");
            dispatch(setHashtag({ hashtag_name: "", count: "0" }));
          }}
          className={`px-6 py-2 rounded-xl cursor-pointer text-xs whitespace-nowrap transition ${
            selectedHashtag === "All"
              ? "bg-main-green text-primary"
              : "bg-dark/[0.04] text-dark"
          }`}
        >
          All
        </button>

        {/* Selected Hashtag beside All */}
        {selectedHashtag !== "All" && (
          <button
            className="bg-main-green text-primary cursor-pointer px-6 py-2 text-xs rounded-xl whitespace-nowrap"
            onClick={() => {
              setSelectedHashtag("All");
              dispatch(setHashtag({ hashtag_name: "", count: "0" }));
            }}
          >
            #{selectedHashtag}
          </button>
        )}

        {/* Remaining Hashtags */}
        {loading && hashtags.length === 0
          ? Array.from({ length: itemsToShow }).map((_, i) => (
              <div
                key={i}
                className="w-24 h-6 bg-gray-200 animate-pulse rounded-xl"
              />
            ))
          : filteredHashtags
              .slice(startIndex, startIndex + itemsToShow)
              .map((hashtag, i) => (
                <button
                  key={hashtag.hashtag_name + i}
                  onClick={() => {
                    setSelectedHashtag(hashtag.hashtag_name);
                    dispatch(
                      setHashtag({
                        hashtag_name: hashtag.hashtag_name,
                        count: hashtag.total_socials,
                      })
                    );
                  }}
                  className="cursor-pointer px-6 py-2 rounded-xl text-xs whitespace-nowrap transition bg-dark/[0.04] text-dark"
                >
                  #{hashtag.hashtag_name}
                </button>
              ))}
      </div>
    </div>
  );
}

export default AllHashtagsName;
