"use client";

import Viewstreamingcenter from "@/app/components/Viewstreaming/Viewstreamingcenter";
import Viewstreamingleftside from "@/app/components/Viewstreaming/Viewstreamingleftside";
import Viewstreamingrightside from "@/app/components/Viewstreaming/Viewstreamingrightside";
import { useAppDispatch, useAppSelector } from "@/app/utils/hooks";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { showModal } from "@/app/store/Slice/ModalsSlice";
import DemoLiveVideo from "@/app/components/DemoLiveVideo";

function Viewstreaming() {
  const dispatch = useAppDispatch();
  const token = Cookies.get("Reelboost_auth_token");

  useEffect(() => {
    if (!token) {
      dispatch(showModal("Signin"));
    }
  }, [token, dispatch]);

  const PeerVideoUrl = useAppSelector((state) => state.ui.Peer_Id)

  const isdemo = useAppSelector((state) => state.ui.isDemo)


  // ⛔ Block page if not logged in
  if (!token) {
    return null; // or loader / backdrop
  }

  return (
    <div className="w-full h-[100dvh] flex flex-row overflow-hidden relative bg-black">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/90 pointer-events-none z-10" />

      {/* Left */}
      <div className="flex-1 h-full overflow-y-auto z-50 relative">
        <Viewstreamingleftside />
      </div>

      {/* Center */}
      <div className="relative w-full md:max-w-full xl:max-w-xl h-full overflow-hidden z-20">


        {isdemo ? (
          <DemoLiveVideo hostPeerId={PeerVideoUrl} />
        ) : (
          <Viewstreamingcenter />
        )}

      </div>

      {/* Right */}
      <div className="flex-1 h-full overflow-y-auto z-20 relative">
        <Viewstreamingrightside />
      </div>
    </div>
  );
}

export default Viewstreaming;
