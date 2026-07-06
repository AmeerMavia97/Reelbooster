"use client";

import { useEffect, useMemo, useRef } from "react";
import { socketInstance } from "../socket/socket";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import VideoPlayer from "./VideoPlayer";
import { useUserProfile } from "../store/api/updateUser";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { useLiveIdApi } from "../store/api/useLiveIdApi";
import { setViewStreamData } from "../store/Slice/viewStreamSlice";
import { setSocketRoomId } from "../store/Slice/uiSlice";


interface Props {
  hostPeerId: string;
}

export default function DemoLiveVideo({ hostPeerId }: Props) {
  const socket = socketInstance();
  const isMuted = useAppSelector((state) => state.ui.isMuted);
  const liveRecords = useAppSelector((state) => state.viewStream.records[0]);
  const pathname = usePathname();
  const liveId = pathname?.split("/").pop();

  /* =======================
     USER DATA
  ======================= */
  const token = Cookies.get("Reelboost_auth_token");
  const { data: userData } = useUserProfile(token ?? "");

  const socket_room_id = liveRecords?.Live.socket_room_id ?? null;

  const user_id = useMemo(() => userData?.data?.user_id ?? null, [userData]);

  const { fetchLive } = useLiveIdApi();

  const dispatch = useAppDispatch();


  // --- Fetch live data ---
  useEffect(() => {
    if (!liveId) return;

    const fetchData = async () => {
      try {
        const response = await fetchLive(liveId);
        const live = response?.data?.Records?.[0];

        if (!live) return;

        console.log("Live data fetched:@@@", response.data);

        dispatch(
          setViewStreamData({
            records: response.data.Records.map((record: any) => ({
              ...record,
              createdAt:
                record.createdAt instanceof Date
                  ? record.createdAt.toISOString()
                  : String(record.createdAt),

              updatedAt:
                record.updatedAt instanceof Date
                  ? record.updatedAt.toISOString()
                  : record.updatedAt
                    ? String(record.updatedAt)
                    : record.updatedAt,
            })),
            pagination: response.data.Pagination,
          })
        );

        dispatch(setSocketRoomId(live.Live?.socket_room_id || null));
      } catch (err) {
        console.error("Error fetching live data:", err);
      }
    };

    fetchData();
  }, [liveId, dispatch, fetchLive]);

  // 🔐 Guard to prevent multiple emits (StrictMode safe)
  const joinedRef = useRef(false);

  const isVideoUrl =
    hostPeerId?.startsWith("http://") ||
    hostPeerId?.startsWith("https://") ||
    hostPeerId?.endsWith(".m3u8");

  useEffect(() => {
    if (!socket_room_id || !user_id) return;
    if (joinedRef.current) return; // ✅ prevent multiple join emits

    socket.emit("join_live", {
      socket_room_id,
      user_id,
      is_demo: true,
    });

    joinedRef.current = true;
  }, [socket, socket_room_id, user_id]);

  if (!isVideoUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full text-white">
        No video available
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-md overflow-hidden">
      <VideoPlayer
        src={hostPeerId}
        autoPlay
        muted={isMuted}      // 🔹 use Redux state for mute
        controls={false}     // 🔹 hide video controls
        width="w-full"
        height="h-full"
      />
    </div>
  );
}
