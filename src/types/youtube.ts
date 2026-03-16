// Video snippet shared structure
export interface VideoSnippet {
  title: string;
  description: string;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium:  { url: string; width: number; height: number };
    high:    { url: string; width: number; height: number };
  };
}

// A single video item
export interface VideoItem {
  id: { videoId: string } | string;
  snippet: VideoSnippet;
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

// A single channel item
export interface ChannelItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl: string;
    thumbnails: {
      default: { url: string };
      medium:  { url: string };
      high:    { url: string };
    };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
}

// API response wrapper
export interface APIResponse<T> {
  kind: string;
  nextPageToken?: string;
  items: T[];
}