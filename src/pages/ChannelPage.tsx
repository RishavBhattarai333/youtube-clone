import { useParams, Link } from "react-router-dom";
import { useYoutube } from "../hooks/useYoutube";
import { fetchChannelById, fetchVideosByChannel } from "../api/youtube";
import type { VideoItem } from "../types/youtube";


// ── Helpers ────────────────────────────────────────────────────
const getVideoId = (id: VideoItem["id"]): string =>
  typeof id === "string" ? id : id.videoId;

const formatCount = (count?: string): string => {
  if (!count) return "0";
  const n = parseInt(count);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
};

const timeAgo = (dateStr: string): string => {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const intervals = [
    { label: "year", secs: 31536000 },
    { label: "month", secs: 2592000 },
    { label: "week", secs: 604800 },
    { label: "day", secs: 86400 },
    { label: "hour", secs: 3600 },
    { label: "minute", secs: 60 },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

// ── Video Card ─────────────────────────────────────────────────
const VideoCard = ({ video }: { video: VideoItem }) => {
  const videoId = getVideoId(video.id);
  const { snippet } = video;
  const thumbnail =
    snippet.thumbnails.high?.url ||
    snippet.thumbnails.medium?.url ||
    snippet.thumbnails.default?.url ||
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <Link to={`/video/${videoId}`} className="group flex flex-col gap-2">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1a1a1a]">
        <img
          src={thumbnail}
          alt={snippet.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="flex flex-col gap-0.5 px-1">
        <p className="text-white text-sm font-semibold line-clamp-2 leading-snug">
          {snippet.title}
        </p>
        <p className="text-gray-400 text-xs">{timeAgo(snippet.publishedAt)}</p>
      </div>
    </Link>
  );
};

// ── Channel Page ───────────────────────────────────────────────
export default function ChannelPage() {
  const { id } = useParams<{ id: string }>();
  const { data: channelData, loading: channelLoading } = useYoutube(fetchChannelById, id);
  const { data: videosData, loading: videosLoading } = useYoutube(fetchVideosByChannel, id);

  const channel = channelData?.items?.[0];

  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      {/* ── Banner ── */}
      <div className="w-full h-32 sm:h-48 bg-gradient-to-r from-red-900 via-red-700 to-orange-600" />

      {/* ── Channel Info ── */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10 sm:-mt-14 mb-6">
          {/* Avatar */}
          {channelLoading ? (
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#272727] animate-pulse border-4 border-[#0f0f0f]" />
          ) : (
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-red-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-[#0f0f0f] flex-shrink-0">
              {channel ? (
                <img
                  src={channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url}
                  alt={channel.snippet.title}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                "?"
              )}
            </div>
          )}

          {/* Name + Stats */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between flex-1 w-full gap-3">
            {channelLoading ? (
              <div className="flex flex-col gap-2 animate-pulse">
                <div className="h-6 bg-[#272727] rounded w-48" />
                <div className="h-4 bg-[#272727] rounded w-32" />
              </div>
            ) : (
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <h1 className="text-white text-2xl font-bold">
                  {channel?.snippet.title || "Unknown Channel"}
                </h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-gray-400 text-sm">
                  {channel?.snippet.customUrl && (
                    <span>{channel.snippet.customUrl}</span>
                  )}
                  <span>{formatCount(channel?.statistics.subscriberCount)} subscribers</span>
                  <span>{formatCount(channel?.statistics.videoCount)} videos</span>
                  <span>{formatCount(channel?.statistics.viewCount)} total views</span>
                </div>
                {channel?.snippet.description && (
                  <p className="text-gray-500 text-sm line-clamp-2 max-w-xl mt-1">
                    {channel.snippet.description}
                  </p>
                )}
              </div>
            )}

            {/* Subscribe Button */}
            <button className="bg-white text-black font-semibold text-sm px-5 py-2 rounded-full hover:bg-gray-200 transition flex-shrink-0">
              Subscribe
            </button>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-b border-[#272727] mb-6" />

        {/* ── Videos Grid ── */}
        <h2 className="text-white font-semibold text-lg mb-4">Videos</h2>

        {videosLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 animate-pulse">
                <div className="w-full aspect-video rounded-xl bg-[#272727]" />
                <div className="h-3 bg-[#272727] rounded w-3/4" />
                <div className="h-3 bg-[#272727] rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!videosLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
            {videosData?.items.length === 0 && (
              <p className="text-gray-400 col-span-full text-center mt-10">
                No videos found for this channel.
              </p>
            )}
            {videosData?.items.map((video) => (
              <VideoCard key={getVideoId(video.id)} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}