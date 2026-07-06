import type { Metadata } from "next";
import { normalizeMediaUrl } from "../../utils/mediaUrl";

interface ReelPageProps {
  params: Promise<{ id: string }>;
}

interface ReelMediaItem {
  media_location: string;
  is_original?: boolean;
}

interface ReelRecord {
  social_id: number;
  social_desc: string;
  reel_thumbnail: string;
  Media: ReelMediaItem[];
  User: { user_name: string };
}

async function fetchReel(id: string): Promise<ReelRecord | null> {
  try {
    const res = await fetch(
      `https://api.yeteneksat.com/api/social/get-social-noauth`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ social_id: Number(id), page: 1, pageSize: 1 }),
        cache: "no-store",
      }
    );
    const json = await res.json();
    return json?.data?.Records?.[0] ?? null;
  } catch {
    return null;
  }
}

function getVideoUrl(reel: ReelRecord): string {
  const media =
    reel.Media?.find((m) => m?.is_original) ?? reel.Media?.[0] ?? null;
  return normalizeMediaUrl(media?.media_location);
}

export async function generateMetadata({
  params,
}: ReelPageProps): Promise<Metadata> {
  const { id } = await params;
  const reel = await fetchReel(id);

  if (!reel) {
    return { title: "yeteneksat.com" };
  }

  const title = `${reel.User?.user_name ?? "yeteneksat.com"} on yeteneksat.com`;
  const description = reel.social_desc || "Watch this video on yeteneksat.com";
  const thumbnail = normalizeMediaUrl(reel.reel_thumbnail);
  const videoUrl = getVideoUrl(reel);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "video.other",
      images: thumbnail ? [thumbnail] : undefined,
      videos: videoUrl ? [{ url: videoUrl, type: "video/mp4" }] : undefined,
    },
    twitter: {
      card: "player",
      title,
      description,
      images: thumbnail ? [thumbnail] : undefined,
    },
  };
}

export default async function ReelSharePage({ params }: ReelPageProps) {
  const { id } = await params;
  const reel = await fetchReel(id);

  if (!reel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-black text-white">
        <p>This video is unavailable.</p>
        <a href="/" className="underline">
          Go to yeteneksat.com
        </a>
      </div>
    );
  }

  const videoUrl = getVideoUrl(reel);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4 py-6">
      <div className="relative w-full max-w-md aspect-[9/16] bg-dark">
        <video
          src={videoUrl}
          poster={normalizeMediaUrl(reel.reel_thumbnail)}
          controls
          playsInline
          className="w-full h-full object-contain"
        />
      </div>

      <p className="text-white text-sm px-4 text-center max-w-md">
        {reel.social_desc}
      </p>

      <a
        href="/"
        className="px-5 py-2 rounded-full bg-main-green text-primary text-sm font-medium"
      >
        Open in yeteneksat.com
      </a>
    </div>
  );
}
