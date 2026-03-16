import { useState } from "react";
import { Link } from "react-router-dom";
import { useYoutube } from "../hooks/useYoutube";
import { fetchHomeFeed } from "../api/youtube";
import type { VideoItem } from "../types/youtube";


const decodeHTML = (str: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

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

// ── Video Card ─────────────────────────────────────────────────
const VideoCard = ({ video }: { video: VideoItem }) => {
  const videoId = getVideoId(video.id);
  const { snippet, statistics } = video;
  const thumbnail = snippet.thumbnails.high?.url || 
                    snippet.thumbnails.medium?.url ||
                    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;


  return (
    <Link to={`/video/${videoId}`} className="group flex flex-col gap-2">
      {/* Thumbnail */}
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

      {/* Info */}
      <div className="flex gap-3 px-1">
        {/* Channel avatar placeholder */}
        <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
          {snippet.channelTitle.charAt(0).toUpperCase()}
        </div>

        <div className="flex flex-col gap-0.5 overflow-hidden">
          {/* Title */}
          <p className="text-white text-sm font-semibold line-clamp-2 leading-snug">
            {decodeHTML(snippet.title)}
          </p>
          {/* Channel */}
          <Link
            to={`/channel/${snippet.channelId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 text-xs hover:text-white transition"
          >
            {snippet.channelTitle}
          </Link>
          {/* Meta */}
          <p className="text-gray-400 text-xs">
            {formatViews(statistics?.viewCount)}
            {statistics?.viewCount && " • "}
            {timeAgo(snippet.publishedAt)}
          </p>
        </div>
      </div>
    </Link>
  );
};

// ── Category Pills ─────────────────────────────────────────────
const CATEGORIES = [
  { id: "0",  label: "All" },
  { id: "10", label: "Music" },
  { id: "20", label: "Gaming" },
  { id: "22", label: "People & Blogs" },
  { id: "23", label: "Comedy" },
  { id: "24", label: "Entertainment" },
  { id: "25", label: "News" },
  { id: "28", label: "Science & Tech" },
];

// ── Home Page ──────────────────────────────────────────────────
const Home = () => {
  const [categoryId, setCategoryId] = useState("0");
  const { data, loading, error } = useYoutube(fetchHomeFeed, categoryId);

  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      {/* Category Pills */}
      <div className="sticky top-14 z-40 bg-[#0f0f0f] flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-[#1f1f1f]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryId(cat.id)}
            className={`flex-shrink-0 px-3 py-1 rounded-lg text-sm font-medium transition
              ${categoryId === cat.id
                ? "bg-white text-black"
                : "bg-[#272727] text-white hover:bg-[#3a3a3a]"
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 animate-pulse">
                <div className="w-full aspect-video rounded-xl bg-[#272727]" />
                <div className="flex gap-3 px-1">
                  <div className="w-9 h-9 rounded-full bg-[#272727] flex-shrink-0" />
                  <div className="flex flex-col gap-2 flex-1 pt-1">
                    <div className="h-3 bg-[#272727] rounded w-full" />
                    <div className="h-3 bg-[#272727] rounded w-3/4" />
                    <div className="h-2 bg-[#272727] rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center mt-10">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data?.items
              .slice()
              .sort(() => Math.random() - 0.5)
              .map((video) => (
                <VideoCard
                  key={getVideoId(video.id)}
                  video={video}
                />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;