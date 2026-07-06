"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useApiPost from "../hooks/postData";
import { UserNotFollowing, UserNotFollowingRecord } from "../types/ResTypes";
import { setUserId } from "../store/Slice/UserIdHashtagIdSlice";
import { useAppDispatch } from "../utils/hooks";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import Cookies from "js-cookie";

function Following() {
  const { postData, loading } = useApiPost();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [users, setUsers] = useState<UserNotFollowingRecord[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);

  const pageRef = useRef(1);
  const hasFetchedRef = useRef(false); // prevent multiple calls for page 1
  const MyUserId = Number(Cookies.get("Reelboost_user_id"));

  // Fetch users not following (with socials)
  const fetchPage = async (pageToFetch: number) => {
    if (pageToFetch === 1 && hasFetchedRef.current) return;

    setFetching(true);
    try {
      const response: UserNotFollowing = await postData(
        "/users/find-user-not-following",
        {
          page: pageToFetch,
        }
      );

      // inside fetchPage
      if (response.status) {
        const filteredRecords = response.data.Records.filter(
          (user) => user.user_id !== MyUserId
        ).filter((user) => user.user_name && user.user_name.trim() !== "");

        // only append once
        setUsers((prev) => [...prev, ...filteredRecords]);

        const totalPages = response.data.Pagination.total_pages;
        setHasMore(pageToFetch < totalPages);

        if (pageToFetch === 1) hasFetchedRef.current = true;
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setFetching(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPage(1);
    pageRef.current = 2;
  }, []);

  // Infinite scroll
  const containerRef = useRef<HTMLDivElement>(null);
  // Infinite scroll - window-based
  const handleScroll = useCallback(() => {
    if (!hasMore || fetching) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= fullHeight - 150) {
      fetchPage(pageRef.current);
      pageRef.current += 1;
    }
  }, [fetching, hasMore]);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Navigate to user profile
  const handleUserRoute = (userId: number) => {
    dispatch(setUserId(userId));
    router.push(`/profile/${userId}`);
  };

  // Follow / Remove user
  // inside handleFollow
  const handleFollow = async (userId: number) => {
    try {
      const res = await postData("/follow/follow-unfollow", {
        user_id: userId,
      });

      if (res.status) {
        toast.success(res.message);

        // ✅ immediately remove followed user
        setUsers((prev) => prev.filter((u) => u.user_id !== userId));
      } else {
        toast.error(res.message || "Failed to follow user");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Shimmer for loading
  const ShimmerCard = () => (
    <div className="h-[320px] rounded-lg overflow-hidden bg-gray-300 animate-pulse relative" />
  );

  return (
    <div
      ref={containerRef}
      className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 py-4 overflow-y-auto h-full"
    >
      {loading && users.length === 0 ? (
        Array.from({ length: 6 }).map((_, idx) => <ShimmerCard key={idx} />)
      ) : users.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-72 col-span-full">
          <Image
            src="/profile/NoReels.png"
            width={80}
            height={80}
            alt="no reels"
          />
        </div>
      ) : (
        users.map((user) => {
          const firstSocial = user.Socials[0];
          return (
            <div
              key={user.user_id}
              className="relative rounded-lg overflow-hidden h-[320px] mx-4 bg-dark"
            >
              {firstSocial && firstSocial.Media?.[0]?.media_location ? (
                <video
                  src={firstSocial.Media[0].media_location}
                  className="h-full w-full object-cover"
                  playsInline
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <div className="h-full w-full bg-dark" />
              )}

              {/* Profile + Follow button */}
              <div className="flex flex-col gap-2 items-center absolute bottom-3 w-full z-20">
                <div
                  className="flex flex-col gap-2 place-items-center cursor-pointer"
                  onClick={() => handleUserRoute(user.user_id)}
                >
                  <Image
                    src={user.profile_pic || "/default-avatar.png"}
                    className="w-8 h-8 rounded-full border border-primary"
                    alt="profile"
                    width={20}
                    height={20}
                  />
                  <h2 className="text-sm font-medium text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    {user.user_name.replace(" ", "").toLowerCase()}
                  </h2>
                </div>

                <button
                  onClick={() => handleFollow(user.user_id)}
                  className="cursor-pointer py-1.5 px-14 rounded-xl font-medium text-sm text-primary bg-main-green"
                >
                  Follow
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Next page shimmer */}
      {fetching &&
        users.length > 0 &&
        Array.from({ length: 3 }).map((_, idx) => (
          <ShimmerCard key={`next-${idx}`} />
        ))}
    </div>
  );
}

export default Following;
