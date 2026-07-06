
"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { RiHeart3Line } from "react-icons/ri";
import useApiPost from "../hooks/postData";
import { Reel, ReelResponse } from "../types/Reels";
import AllHashtagsName from "./AllHashtagsName";
import { useAppSelector, useAppDispatch } from "../utils/hooks";
import Image from "next/image";
import { setSelectedReel } from "../store/Slice/SelectedReelDetail";
import { setActiveCommentPostId, setActiveUserId } from "../store/Slice/ActiveCommentBox";
import ReelDetailsModal from "./SelectedReelModal";
// import ActionButtons from "./ActionButtons"; // Import ActionButtons
import ActionButtons from "../home/ActionButtons";
import { setCommentAddedFalse, setReelSharedFalse } from "../store/Slice/handleCommentCount";

function Explore() {
  const { postData, loading } = useApiPost();
  const [reels, setReels] = useState<Reel[]>([]);
  const dispatch = useAppDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const pageRef = useRef(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const hashtagName = useAppSelector((state) => state.userId.hashtag_name);
  const isAllSelected = !hashtagName || hashtagName.trim() === "";
  const commentAdded = useAppSelector((state) => state.commentAdded.commentAdded);
  const ReelSharedId = useAppSelector((state) => state.commentAdded.ReelSharedId);
  const activeCommentPostId = useAppSelector((state) => state.comment.activeCommentPostId);

  const fetchReels = async (pageToFetch: number) => {
    setFetching(true);
    try {
      const payload: {
        social_type: string;
        page: number;
        hashtag?: string;
      } = {
        social_type: "reel",
        page: pageToFetch,
      };
      if (!isAllSelected) {
        payload.hashtag = hashtagName;
      }
      const response: ReelResponse = await postData("/social/get-social", payload);
      if (response.status) {
        setReels((prev) => [...prev, ...response.data.Records]);
        const totalPages = response.data.Pagination?.total_pages ?? 1;
        setHasMore(pageToFetch < totalPages);
      } else {
      }
    } catch (error) {
    } finally {
      setFetching(false);
    }
  };

  // Track already fetched hashtags to prevent duplicate calls
  const fetchedHashtags = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchInitial = async () => {
      const safeHashtagName = hashtagName ?? "";
      if (fetchedHashtags.current.has(safeHashtagName)) return;
      fetchedHashtags.current.add(safeHashtagName);
      setReels([]);
      setHasInitialLoad(false);
      pageRef.current = 1;
      await fetchReels(1);
      await fetchReels(2);
      pageRef.current = 3;
      setHasInitialLoad(true);
    };
    fetchInitial();
  }, [hashtagName]);

  // Handle comment count increment
  useEffect(() => {
    if (commentAdded && activeCommentPostId) {
      setReels((prevReels) =>
        prevReels.map((r) =>
          r.social_id === activeCommentPostId
            ? {
                ...r,
                total_comments: (Number(r.total_comments) || 0) + 1,
              }
            : r
        )
      );
      dispatch(setCommentAddedFalse());
    }
  }, [commentAdded, activeCommentPostId, dispatch]);

  // Handle share count increment
  useEffect(() => {
    if (ReelSharedId) {
      setReels((prevReels) =>
        prevReels.map((r) =>
          r.social_id === ReelSharedId
            ? {
                ...r,
                total_shares: (Number(r.total_shares) || 0) + 1,
              }
            : r
        )
      );
      dispatch(setReelSharedFalse());
    }
  }, [ReelSharedId, dispatch]);

  const lastReelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!hasInitialLoad || fetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !fetching) {
          fetchReels(pageRef.current);
          pageRef.current += 1;
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, fetching, hasInitialLoad]
  );

  const ShimmerCard = () => (
    <div className="flex flex-col gap-1 animate-pulse">
      <div className="relative rounded-lg overflow-hidden h-[250px] bg-gray-300">
        <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300" />
        <div className="absolute bottom-0 left-0 w-full h-[70px] bg-gradient-to-t from-gray-300 via-gray-200 to-transparent" />
      </div>
      <div className="flex gap-1 place-items-center">
        <div className="w-6 h-6 rounded-full bg-gray-300" />
        <div className="h-4 w-16 rounded bg-gray-300" />
      </div>
    </div>
  );

  return (
    <>
      <div className="py-4 px-4 2xl:px-0 mb-10">
        <h1 className="text-xl text-dark font-semibold">Explore</h1>
        <AllHashtagsName />
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 xl:grid-cols-4 gap-4 py-4">
          {(loading && reels.length === 0) || !hasInitialLoad ? (
            Array.from({ length: 8 }).map((_, idx) => <ShimmerCard key={idx} />)
          ) : reels.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-32 col-span-full">
              <Image src="/profile/NoReels.png" alt="no reels" width={80} height={80} />
            </div>
          ) : (
            reels.map((reel, idx) => {
              const isLast = idx === reels.length - 1;
              return (
                <div
                  key={idx}
                  ref={isLast ? lastReelRef : null}
                  className="flex flex-col gap-1 cursor-pointer"
                >
                  <div
                    className="relative rounded-lg overflow-hidden 2xl:max-w-96 xl:max-w-60 h-[250px] bg-dark"
                    onClick={() => {
                      dispatch(setSelectedReel(reel));
                      dispatch(setActiveCommentPostId(reel.social_id));
                      dispatch(setActiveUserId(reel.User.user_id));
                    }}
                  >
                    <video
                      src={reel.Media[0]?.media_location}
                      className="h-full w-full object-cover"
                      playsInline
                      autoPlay
                      muted
                      loop
                    />
                    <div className="absolute bottom-0 left-0 w-full sm:h-[70px] bg-gradient-to-t from-dark via-dark/40 to-transparent z-10" />
                    <div className="flex gap-1 place-items-center absolute bottom-3 left-3 z-20">
                      <RiHeart3Line />
                      <p className="text-primary font-medium text-xs">
                        {reel.total_likes}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 place-items-center cursor-pointer">
                    <div className="rounded-full">
                      <Image
                        src={reel.User.profile_pic}
                        className="w-5.5 h-5.5 rounded-full object-cover"
                        alt={reel.User.user_name}
                        width={50}
                        height={50}
                      />
                    </div>
                    <p className="text-dark text-[12px]">{reel.User.user_name}</p>
                  </div>
                </div>
              );
            })
          )}
          {fetching &&
            reels.length > 0 &&
            Array.from({ length: 4 }).map((_, idx) => (
              <ShimmerCard key={"fetching-" + idx} />
            ))}
        </div>
      </div>
      <ReelDetailsModal setReels={setReels} />
    </>
  );
}

export default Explore;