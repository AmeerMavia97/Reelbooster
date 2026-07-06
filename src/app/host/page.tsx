"use client"
import React from 'react'
import CommentListMain from '../components/Hoster/CommentList/CommentListMain'
import StreamMain from '../components/Hoster/Stream/StreamMain'
import LiveGiftlistman from '../components/Hoster/LikeGiftlist/LiveGiftlistman'

function page() {
  return (
   <div className="w-full h-[100dvh] flex flex-row overflow-hidden relative bg-black">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/90 pointer-events-none z-10"></div>

            {/* Left Side */}
            <div className="flex-1 h-full overflow-y-auto hidden md:block  z-50 relative">
                <CommentListMain />
            </div>

            {/* Center */}
            <div className="relative w-full   md:max-w-full xl:max-w-xl h-full overflow-hidden z-20 border-none">
                <StreamMain />
            </div>

            {/* Right Side */}
            <div className="flex-1 h-full overflow-y-auto hidden md:block  z-20 relative">
                <LiveGiftlistman/>
            </div>
        </div>
  )
}

export default page
