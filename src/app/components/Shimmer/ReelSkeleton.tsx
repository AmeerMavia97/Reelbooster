const ReelSkeleton = () => {
  return (
    <div className="h-screen snap-start flex justify-center items-center animate-pulse">
      <div className="flex gap-4 px-4 max-w-5xl w-full justify-center items-center">
        <div className="relative w-full max-w-lg h-screen bg-gray-300 rounded-lg" />

        <div className="flex flex-col gap-5 translate-y-[250px]">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="rounded-full bg-gray-300 p-4 w-10 h-10" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReelSkeleton
