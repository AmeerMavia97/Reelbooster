import React from "react";

export default function LoadingGlobal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-14 h-14">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-75" />
        
        {/* Inner ring */}
        <div className="relative w-14 h-14 rounded-full border-4 border-white animate-pulse" />
      </div>
    </div>
  );
}
