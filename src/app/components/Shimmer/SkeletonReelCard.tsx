// components/SkeletonReelCard.tsx
export default function SkeletonReelCard() {
  return (
    <div className="animate-pulse flex flex-col gap-1">
      <div className="relative rounded-lg overflow-hidden h-[250px] bg-gray-300" />
    </div>
  );
}
