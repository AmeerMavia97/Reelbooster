// "use client";
// import Image from "next/image";
// import React from "react";
// import { AiOutlineEye } from "react-icons/ai";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import GoLive from "./GoLive";
// import { useAppDispatch } from "../utils/hooks";
// import { useLiveApi } from "../store/api/LiveReels";
// import { LiveList, LiveRecord } from "../types/LiveReels";
// import { setLiveData, setSelectedLive } from "../store/Slice/LiveSlice";
// import { showModal } from "../store/Slice/ModalsSlice";

// function Live() {
//   const dispatch = useAppDispatch();
//   const { fetchLive } = useLiveApi();

//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
//     useInfiniteQuery<LiveList, Error>({
//       queryKey: ["liveReels"],
//       queryFn: ({ pageParam }) => fetchLive(pageParam as number),
//       getNextPageParam: (lastPage) => {
//         const currentPage = lastPage?.data?.Pagination?.current_page;
//         const totalPages = lastPage?.data?.Pagination?.total_pages;
//         return currentPage < totalPages ? currentPage + 1 : undefined;
//       },
//       initialPageParam: 1, // ✅ required in v5
//     });

//   // flatten pages
//   const live: LiveRecord[] =
//     data?.pages.flatMap((page) => page.data.Records) || [];



//   console.log("my live Records", live)

//   // infinite scroll
//   React.useEffect(() => {
//     const handleScroll = () => {
//       const bottom =
//         window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
//       if (bottom && hasNextPage && !isFetchingNextPage) {
//         fetchNextPage();
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [fetchNextPage, hasNextPage, isFetchingNextPage]);


//   const ShimmerCard = () => (
//     <div className="animate-pulse bg-gray-300 h-[250px] w-full rounded-lg" />
//   );

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className=" w-full  ">

//         <GoLive />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
//         {isLoading ? (
//           // Render 8 shimmer cards
//           Array.from({ length: 8 }).map((_, idx) => <ShimmerCard key={idx} />)
//         ) : live.length === 0 ? (
//           <div className="flex flex-col gap-3 justify-center items-center sm:py-56 py-36 w-full col-span-full">
//             <Image
//               src="/ReelBoost/NoLive.png"
//               alt="No live available"
//               className="object-contain"
//               height={80}
//               width={80}
//             />
//             <p className="text-sm font-semibold text-dark">No Live</p>
//           </div>
//         ) : (
//           live.map((item, idx) => (
//             <div
//               key={idx}
//               className="relative rounded-lg overflow-hidden h-[280px] w-[260px] justify-center items-center flex bg-dark cursor-pointer"
//               style={{
//                 backgroundImage: item?.Live_hosts?.[0]?.User?.profile_pic
//                   ? `url(${item.Live_hosts[0].User.profile_pic})`
//                   : "none",
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//               }}
//               onClick={() => {
//                 dispatch(setSelectedLive(item));
//                 dispatch(
//                   setLiveData({
//                     socket_room_id: item.socket_room_id,
//                     user_id: item.Live_hosts[0].user_id,
//                   })
//                 );
//                 dispatch(showModal("LivePopup"));
//               }}
//             >
//               {/* Profile Info */}
//               <div className="flex gap-1 items-center absolute bottom-3 left-3 z-20">
//                 <div className="w-8 h-8 rounded-full overflow-hidden shadow-md">
//                   <Image
//                     src={item?.Live_hosts[0]?.User.profile_pic || "/avatar.jpg"}
//                     alt="Profile"
//                     width={32}
//                     height={32}
//                     className="object-cover w-full h-full"
//                   />
//                 </div>
//                 <p className="text-sm font-semibold text-primary px-2 py-0.5 rounded-lg">
//                   {item?.Live_hosts[0]?.User.user_name}
//                 </p>
//               </div>

//               {/* Likes + Views */}
//               <div className="flex gap-2 rounded-l-md py-1 px-2 absolute top-2 right-0 bg-dark/70 z-20">
//                 <div className="flex gap-1 items-center">
//                   <Image src="/SidebarIcons/heart.png" alt="heart" width={12} height={12} />
//                   <p className="font-medium text-primary text-[10px]">{item?.likes}</p>
//                 </div>
//                 <div className="flex gap-1 items-center">
//                   <AiOutlineEye className="w-4 h-4" />
//                   <p className="font-medium text-primary text-[10px]">{item?.total_viewers}</p>
//                 </div>
//               </div>

//               {/* Live Badge */}
//               <div className="bg-red absolute top-2 left-2 py-1 px-4 text-primary font-medium text-[10px] rounded-md z-20">
//                 Live
//               </div>
//             </div>

//           ))
//         )}
//       </div>

//       {/* Optional bottom loader when fetching more */}
//       {isFetchingNextPage && (
//         <div className="text-center py-4 text-gray-500 text-sm">
//           Loading more...
//         </div>
//       )}
//     </div>
//   );
// }

// export default Live;



"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { AiOutlineEye } from "react-icons/ai";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import GoLive from "./GoLive";
import { useLiveApi } from "../store/api/LiveReels";
import { useAppDispatch } from "../utils/hooks";
import { setLiveData } from "../store/Slice/LiveSlice";

import { LiveApiResponse, RecordItem } from "../types/NewLiveType";
import { setPeerId } from "../store/Slice/uiSlice";

/* -------------------------------------------------------------------------- */
/*                              Helper Components                              */
/* -------------------------------------------------------------------------- */

const ShimmerCard = React.memo(() => (
  <div className="animate-pulse bg-gray-300 h-[280px] w-[260px] rounded-lg" />
));

interface LiveCardProps {
  item: RecordItem;
  onClick: () => void;
}

const LiveCard = React.memo(({ item, onClick }: LiveCardProps) => {

  const profilePic = item.Live?.Live_hosts[0]?.User?.profile_pic || "/avatar.jpg";
  const userName = item.Live?.Live_hosts[0]?.User?.user_name || "Unknown";

  return (
    <div
      onClick={onClick}
      className="relative rounded-lg overflow-hidden h-[280px] w-[260px] flex bg-dark cursor-pointer"
      style={{
        backgroundImage: `url(${profilePic})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Profile Info */}
      <div className="flex gap-2 items-center absolute bottom-3 left-3 z-20">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/40">
          <Image
            src={profilePic}
            alt={userName}
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        </div>
        <p className="text-sm font-semibold text-primary truncate max-w-[140px]">
          {userName}
        </p>
      </div>

      {/* Likes & Views */}
      <div className="flex gap-3 absolute top-2 right-0 bg-dark/70 px-3 py-1 rounded-l-md z-20">
        <div className="flex gap-1 items-center">
          <Image src="/SidebarIcons/heart.png" alt="likes" width={12} height={12} />
          <p className="text-[10px] text-primary">{item.Live.likes}</p>
        </div>

        <div className="flex gap-1 items-center">
          <AiOutlineEye className="w-4 h-4 text-primary" />
          <p className="text-[10px] text-primary">
            {item.Live.total_viewers}
          </p>
        </div>
      </div>

      {/* Live Badge */}
      <div className="absolute top-2 left-2 bg-red px-4 py-1 text-[10px] font-medium rounded-md z-20">
        Live
      </div>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

export default function Live() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { fetchLive } = useLiveApi();

  /* ----------------------------- API Query -------------------------------- */

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<LiveApiResponse, Error>({
    queryKey: ["liveReels"],
    queryFn: ({ pageParam = 1 }) => fetchLive(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, total_pages } =
        lastPage.data?.Pagination || {};
      return current_page && total_pages && current_page < total_pages
        ? current_page + 1
        : undefined;
    },
  });

  /* ----------------------------- Data Normalize ---------------------------- */

  const liveRecords: RecordItem[] = useMemo(
    () => data?.pages.flatMap((page) => page.data.Records) || [],
    [data]
  );

  /* ----------------------------- Infinite Scroll --------------------------- */

  const handleScroll = useCallback(() => {
    const isBottom =
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200;

    if (isBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ----------------------------- Handlers ---------------------------------- */



  const handleCardClick = useCallback(

   

  (item: RecordItem) => {
     console.log("Card clicked", item?.peer_id)
    if (!item?.live_host_id) {
      console.error("❌ live_host_id missing", item.peer_id);
      return;
    }




    dispatch(
      setLiveData({
        socket_room_id: item.Live.socket_room_id,
        user_id: item.user_id,
      })
    );

       dispatch(setPeerId({ peerId: item.peer_id, is_demo: item.Live.is_demo }));

    // alert("2")

    router.push(`/live/${item.live_host_id}`);

    // alert("3")
  },
  [dispatch, router]
);


  /* -------------------------------------------------------------------------- */

  return (
    <div className="max-w-6xl mx-auto">
      {/* Go Live */}
      <div className="w-full ">
        <GoLive />
      </div>

      {/* Live Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <ShimmerCard key={i} />)
        ) : liveRecords.length === 0 ? (
          <div className="flex flex-col gap-3 justify-center items-center py-40 w-full col-span-full">
            <Image
              src="/ReelBoost/NoLive.png"
              alt="No Live"
              width={80}
              height={80}
            />
            <p className="text-sm font-semibold text-dark">No Live</p>
          </div>
        ) : (
          liveRecords.map((item) => (
            <LiveCard
              key={item.live_host_id}
              item={item}
              onClick={() => handleCardClick(item)}
            />
          ))
        )}
      </div>

      {/* Pagination Loader */}
      {isFetchingNextPage && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Loading more...
        </div>
      )}
    </div>
  );
}
