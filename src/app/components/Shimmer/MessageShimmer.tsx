// components/Shimmer.tsx
import React from "react";

interface ShimmerProps {
  className?: string;
  count?: number;
}

const Shimmer: React.FC<ShimmerProps> = ({ className = "", count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
        />
      ))}
    </>
  );
};

export default Shimmer;
