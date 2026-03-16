import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useYoutube } from "../hooks/useYoutube";
import { fetchVideoById, fetchRelatedVideos } from "../api/youtube";
import type { VideoItem } from "../types/youtube";

// ✅ Import your custom action icons
import { likeIcon, dislikeIcon, shareIcon, saveIcon, castIcon } from "../assets";

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
    { label: "year",   secs: 31536000 },
    { label: "month",  secs: 2592000  },
    { label: "week",   secs: 604800   },
    { label: "day",    secs: 86400    },
    { label: "hour",   secs: 3600     },
    { label: "minute", secs: 60       },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

// ── ✅ Video Action Buttons (Like, Dislike, Share, Save, Cast) ──
const VideoActions = ({ likes, views, comments }: {
  likes?: string;
  views?: string;
  comments?: string;
}) => (
  <div className="flex flex-wrap items-center gap-2 mt-3">

    {/* Like — shows count from API */}
    <button className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] text-white px-4 py-2 rounded-full transition">
      <img src={likeIcon} alt="like" className="w-5 h-5" />
      <span className="text-sm">{formatCount(likes)}</span>
    </button>

    {/* Dislike */}
    <button className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] text-white px-4 py-2 rounded-full transition">
      <img src={dislikeIcon} alt="dislike" className="w-5 h-5" />
    </button>

    {/* Views */}
    <div className="flex items-center gap-2 bg-[#272727] text-white px-4 py-2 rounded-full">
      <span className="text-sm">👁️ {formatCount(views)}</span>
    </div>

    {/* Comments */}
    <div className="flex items-center gap-2 bg-[#272727] text-white px-4 py-2 rounded-full">
      <span className="text-sm">💬 {formatCount(comments)}</span>
    </div>

    {/* Share */}
    <button className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] text-white px-4 py-2 rounded-full transition">
      <img src={shareIcon} alt="share" className="w-5 h-5" />
      <span className="text-sm">Share</span>
    </button>

    {/* Save */}
    <button className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] text-white px-4 py-2 rounded-full transition">
      <img src={saveIcon} alt="save" className="w-5 h-5" />
      <span className="text-sm">Save</span>
    </button>

    {/* Cast */}
    <button className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] text-white px-4 py-2 rounded-full transition">
      <img src={castIcon} alt="cast" className="w-5 h-5" />
    </button>

  </div>
);

// ── Related Video Card ─────────────────────────────────────────
const RelatedCard = ({ video }: { video: VideoItem }) => {
  const videoId = getVideoId(video.id);
  const { snippet } = video;
  const thumbnail = snippet.thumbnails.medium?.url ||
                    snippet.thumbnails.default?.url ||
                    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <Link
      to={`/video/${videoId}`}
      className="flex gap-2 group hover:bg-[#1a1a1a] rounded-lg p-1 transition"
    >
      <div className="flex-shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-[#272727]">
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
      <div className="flex flex-col gap-1 overflow-hidden">
        <p className="text-white text-xs font-semibold line-clamp-2 leading-snug">
          {snippet.title}
        </p>
        <p className="text-gray-400 text-xs">{snippet.channelTitle}</p>
        <p className="text-gray-500 text-xs">{timeAgo(snippet.publishedAt)}</p>
      </div>
    </Link>
  );
};

// ── Video Detail Page ──────────────────────────────────────────
export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: videoData, loading: videoLoading } = useYoutube(fetchVideoById, id);
  const { data: relatedData, loading: relatedLoading } = useYoutube(fetchRelatedVideos, id);

  const video = videoData?.items?.[0];
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#0f0f0f] min-h-screen px-4 py-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* ── Left: Player + Info ─────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Video Player */}
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
            {id && (
              <iframe
                src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>

          {/* Loading skeleton */}
          {videoLoading && (
            <div className="mt-4 flex flex-col gap-3 animate-pulse">
              <div className="h-5 bg-[#272727] rounded w-3/4" />
              <div className="h-4 bg-[#272727] rounded w-1/2" />
            </div>
          )}

          {video && (
            <div className="mt-4 flex flex-col gap-3">

              {/* Title */}
              <h1 className="text-white text-xl font-bold leading-snug">
                {video.snippet.title}
              </h1>

              {/* Channel row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Link
                  to={`/channel/${video.snippet.channelId}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                    {video.snippet.channelTitle.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-white text-sm font-semibold group-hover:text-red-400 transition">
                    {video.snippet.channelTitle}
                  </p>
                </Link>
              </div>

              {/* ✅ VideoActions replaces the old emoji stats row */}
              <VideoActions
                likes={video.statistics?.likeCount}
                views={video.statistics?.viewCount}
                comments={video.statistics?.commentCount}
              />

              {/* Description */}
              <div className="bg-[#1a1a1a] rounded-xl p-4">
                <p className="text-gray-400 text-xs mb-2">
                  {timeAgo(video.snippet.publishedAt)}
                </p>
                <p className={`text-gray-300 text-sm whitespace-pre-wrap leading-relaxed ${
                  !expanded ? "line-clamp-3" : ""
                }`}>
                  {video.snippet.description}
                </p>
                {video.snippet.description.length > 200 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-white text-sm font-semibold mt-2 hover:text-gray-300 transition"
                  >
                    {expanded ? "Show less" : "Show more"}
                  </button>
                )}
              </div>

            </div>
          )}
        </div>

        {/* ── Right: Related Videos ────────────────────────────── */}
        <div className="w-full lg:w-96 flex flex-col gap-3">
          <h2 className="text-white font-semibold text-sm">Related Videos</h2>

          {relatedLoading && (
            <div className="flex flex-col gap-3 animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-2 p-1">
                  <div className="flex-shrink-0 w-40 aspect-video rounded-lg bg-[#272727]" />
                  <div className="flex flex-col gap-2 flex-1 pt-1">
                    <div className="h-3 bg-[#272727] rounded w-full" />
                    <div className="h-3 bg-[#272727] rounded w-3/4" />
                    <div className="h-2 bg-[#272727] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!relatedLoading && (
            <div className="flex flex-col gap-2">
              {relatedData?.items.map((video) => (
                <RelatedCard key={getVideoId(video.id)} video={video} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}