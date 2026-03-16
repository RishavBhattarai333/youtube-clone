import { Link } from "react-router-dom";
import type { VideoItem } from "../types/youtube";
import { decodeHTML, timeAgo } from "../utils/helpers";

const getVideoId = (id: VideoItem["id"]): string =>
  typeof id === "string" ? id : id.videoId;

const VideoCard = ({ video }: { video: VideoItem }) => {
  const videoId = getVideoId(video.id);
  const { snippet, statistics } = video;
  const thumbnail =
    snippet.thumbnails.high?.url ||
    snippet.thumbnails.medium?.url ||
    snippet.thumbnails.default?.url;

  return (
    <Link to={`/video/${videoId}`} className="group flex flex-col gap-2">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#1a1a1a]">
        <img
          src={thumbnail}
          alt={snippet.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="flex gap-3 px-1">
        <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
          {snippet.channelTitle.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col gap-0.5 overflow-hidden">
          <p className="text-white text-sm font-semibold leading-snug line-clamp-2">
            {decodeHTML(snippet.title)}
          </p>
          <Link
            to={`/channel/${snippet.channelId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-gray-400 text-xs hover:text-white transition"
          >
            {snippet.channelTitle}
          </Link>
          <p className="text-gray-400 text-xs">
            {statistics?.viewCount && `${statistics.viewCount} views • `}
            {timeAgo(snippet.publishedAt)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;