import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useYoutube } from "../hooks/useYoutube";
import { searchVideos } from "../api/youtube";
import type { VideoItem } from "../types/youtube";


// ── Helpers ────────────────────────────────────────────────────
const getVideoId = (id: VideoItem["id"]): string =>
  typeof id === "string" ? id : id.videoId;

const formatViews = (count?: string): string => {
  if (!count) return "";
  const n = parseInt(count);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
};

const timeAgo = (dateStr: string): string => {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
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

// ── Search Result Row ──────────────────────────────────────────
const SearchResultCard = ({ video }: { video: VideoItem }) => {
  const navigate = useNavigate();
  const videoId = getVideoId(video.id);
  const { snippet, statistics } = video;
  const thumbnail =
    snippet.thumbnails.high?.url ||
    snippet.thumbnails.medium?.url ||
    snippet.thumbnails.default?.url ||
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    

  return (
    // <Link
    //   to={`/video/${videoId}`}
    //   className="flex gap-4 group hover:bg-[#1a1a1a] rounded-xl p-2 transition"
    // >
    //   {/* Thumbnail */}
    //   <div className="relative flex-shrink-0 w-64 aspect-video rounded-xl overflow-hidden bg-[#272727]">
    //     <img
    //       src={thumbnail}
    //       alt={snippet.title}
    //       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
    //     />
    //   </div>

    //   {/* Info */}
    //   <div className="flex flex-col gap-1 pt-1 overflow-hidden">
    //     <p className="text-white text-base font-semibold line-clamp-2 leading-snug">
    //       {snippet.title}
    //     </p>
    //     <p className="text-gray-400 text-xs">
    //       {formatViews(statistics?.viewCount)}
    //       {statistics?.viewCount && " • "}
    //       {timeAgo(snippet.publishedAt)}
    //     </p>
    //     <Link
    //       to={`/channel/${snippet.channelId}`}
    //       onClick={(e) => e.stopPropagation()}
    //       className="flex items-center gap-2 mt-1 w-fit"
    //     >
    //       <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
    //         {snippet.channelTitle.charAt(0).toUpperCase()}
    //       </div>
    //       <span className="text-gray-400 text-xs hover:text-white transition">
    //         {snippet.channelTitle}
    //       </span>
    //     </Link>
    //     <p className="text-gray-500 text-xs line-clamp-2 mt-1">
    //       {snippet.description}
    //     </p>
    //   </div>
    // </Link>
    <div
  onClick={() => navigate(`/video/${videoId}`)}
  className="flex gap-4 group hover:bg-[#1a1a1a] rounded-xl p-2 transition cursor-pointer"
>
  {/* Thumbnail */}
  <div className="relative flex-shrink-0 w-64 aspect-video rounded-xl overflow-hidden bg-[#272727]">
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

  {/* Info */}
  <div className="flex flex-col gap-1 pt-1 overflow-hidden">
    <p className="text-white text-base font-semibold line-clamp-2 leading-snug">
      {snippet.title}
    </p>
    <p className="text-gray-400 text-xs">
      {formatViews(statistics?.viewCount)}
      {statistics?.viewCount && " • "}
      {timeAgo(snippet.publishedAt)}
    </p>

    {/* ✅ Channel link — no longer nested inside <a> */}
    <Link
      to={`/channel/${snippet.channelId}`}
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-2 mt-1 w-fit"
    >
      <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
        {snippet.channelTitle.charAt(0).toUpperCase()}
      </div>
      <span className="text-gray-400 text-xs hover:text-white transition">
        {snippet.channelTitle}
      </span>
    </Link>

    <p className="text-gray-500 text-xs line-clamp-2 mt-1">
      {snippet.description}
    </p>
  </div>
</div>
  );
};

// ── Search Results Page ────────────────────────────────────────
export default function SearchResults() {
  const { query } = useParams<{ query: string }>();
  const decodedQuery = decodeURIComponent(query || "");
  const { data, loading, error } = useYoutube(searchVideos, decodedQuery);

  return (
    <div className="bg-[#0f0f0f] min-h-screen px-4 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <p className="text-gray-400 text-sm mb-4">
        Search results for{" "}
        <span className="text-white font-semibold">"{decodedQuery}"</span>
      </p>

      {/* Loading skeletons */}
      {loading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse p-2">
              <div className="flex-shrink-0 w-64 aspect-video rounded-xl bg-[#272727]" />
              <div className="flex flex-col gap-2 flex-1 pt-1">
                <div className="h-4 bg-[#272727] rounded w-full" />
                <div className="h-4 bg-[#272727] rounded w-3/4" />
                <div className="h-3 bg-[#272727] rounded w-1/4 mt-1" />
                <div className="h-3 bg-[#272727] rounded w-1/2 mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-center mt-10">{error}</p>
      )}

      {/* Results */}
      {!loading && !error && (
        <div className="flex flex-col gap-2">
          {data?.items.length === 0 && (
            <p className="text-gray-400 text-center mt-10">
              No results found for "{decodedQuery}"
            </p>
          )}
          {data?.items.map((video) => (
            <SearchResultCard
              key={getVideoId(video.id)}
              video={video}
            />
          ))}
        </div>
      )}
    </div>
  );
}