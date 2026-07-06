"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBlockedUsers } from "@/app/store/api/getBlockedList";
import { BlockedList, BlockUnblockResponse } from "@/app/types/ResTypes";
import useApiPost from "@/app/hooks/postData";
import { toast } from "react-toastify";

export default function BlockedListPage() {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<BlockedList>({
      queryKey: ["blockedUsers"],
      queryFn: ({ pageParam }) =>
        fetchBlockedUsers({ pageParam: pageParam as number }),
      getNextPageParam: (lastPage) => {
        const { current_page, total_pages } = lastPage.data.Pagination;
        return current_page < total_pages ? current_page + 1 : undefined;
      },
      initialPageParam: 1,
    });

  const observerRef = useRef<HTMLDivElement | null>(null);

  const { postData } = useApiPost();
  const handleBlockUnblock = async (userId: number) => {
    try {
      const response: BlockUnblockResponse = await postData(
        "/block/block-unblock",
        { user_id: userId }
      );
      if (response.status) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["blockedUsers"] }); // ✅ refresh list
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

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

  const blockedUsers = data?.pages.flatMap((p) => p.data.Records) ?? [];
  return (
    <>
        
        <h1 className="text-lg font-bold text-dark sm:block hidden p-6">Blocked List</h1>


      {blockedUsers.length > 0 ? (
        <>
          {/* Search Bar */}
          {/* <div className="flex flex-col mt-4 px-9">
            <div className="relative">
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2">
                <Image
                  src="/home/search_icon.png"
                  alt="Search"
                  width={20}
                  height={20}
                />
              </div>
              <input
                type="text"
                className="border border-dark bg-dark/[0.04] text-dark rounded-2xl w-full py-2 pl-10 placeholder:text-sm"
                placeholder="Search User"
              />
            </div>
          </div> */}

          {/* Users List */}
          {blockedUsers.map((record) => {
            const user = record.blocked;
            return (
              <div
                key={record.block_id}
                className="flex justify-between border-b items-center py-2 sm:mx-12 mt-4"
              >
                <div className="flex gap-3">
                  <Image
                    src={user.profile_pic}
                    alt={user.first_name}
                    className="h-12 w-12 object-cover rounded-full"
                    width={48}
                    height={48}
                  />
                  <div>
                    <h2 className="font-semibold text-sm text-dark">
                      {user.first_name}
                    </h2>
                    <p className="text-[#747474] text-xs">{user.user_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBlockUnblock(user.user_id)}
                  className="rounded-xl text-xs h-fit px-6 py-1.5 cursor-pointer border border-main-green text-dark"
                >
                  Unblock
                </button>
              </div>
            );
          })}

          {/* Infinite Scroll Loader */}
          <div ref={observerRef} className="py-4 text-center">
            {isFetchingNextPage && <span>Loading more...</span>}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center py-52">
          <Image
            src="/Setting/NoBlocks.png"
            alt="No blocks"
            width={80}
            height={80}
          />
          <span className="text-dark text-sm">No Blocked Users</span>
        </div>
      )}
    </>
  );
}
