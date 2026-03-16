import axios from "axios";
import type { APIResponse, VideoItem, ChannelItem } from "../types/youtube";

// ── Base config ────────────────────────────────────────────────
const BASE_URL = "https://youtube-v31.p.rapidapi.com";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-RapidAPI-Key":  import.meta.env.VITE_RAPIDAPI_KEY,
    "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
  },
});

// ── Generic fetcher (used internally) ─────────────────────────
const fetchFromAPI = async <T>(endpoint: string, params: object): Promise<T> => {
  try {
    const { data } = await apiClient.get<T>(endpoint, { params });
    return data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Invalid API key. Check your .env file.");
    }
    if (error.response?.status === 429) {
      throw new Error("API quota exceeded. Try again tomorrow.");
    }
    throw new Error(error.message || "Something went wrong.");
  }
};

// ── 1. Fetch Home Feed (trending/category videos) ──────────────
export const fetchHomeFeed = async (categoryId = "0") => {
  return fetchFromAPI<APIResponse<VideoItem>>("/videos", {
    part: "snippet,statistics",
    chart: "mostPopular",
    regionCode: "US",
    videoCategoryId: categoryId,
    maxResults: 20,
  });
};

// ── 2. Search Videos ───────────────────────────────────────────
export const searchVideos = async (query: string, pageToken = "") => {
  return fetchFromAPI<APIResponse<VideoItem>>("/search", {
    part: "snippet",
    q: query,
    type: "video",
    maxResults: 20,
    ...(pageToken && { pageToken }),
  });
};

// ── 3. Fetch Single Video Details ─────────────────────────────
export const fetchVideoById = async (videoId: string) => {
  return fetchFromAPI<APIResponse<VideoItem>>("/videos", {
    part: "snippet,statistics",
    id: videoId,
  });
};

// ── 4. Fetch Related Videos ────────────────────────────────────
export const fetchRelatedVideos = async (videoId: string) => {
  return fetchFromAPI<APIResponse<VideoItem>>("/search", {
    part: "snippet",
    relatedToVideoId: videoId,
    type: "video",
    maxResults: 15,
  });
};

// ── 5. Fetch Channel Details ───────────────────────────────────
export const fetchChannelById = async (channelId: string) => {
  return fetchFromAPI<APIResponse<ChannelItem>>("/channels", {
    part: "snippet,statistics",
    id: channelId,
  });
};

// ── 6. Fetch Videos by Channel ─────────────────────────────────
export const fetchVideosByChannel = async (channelId: string) => {
  return fetchFromAPI<APIResponse<VideoItem>>("/search", {
    part: "snippet",
    channelId: channelId,
    type: "video",
    maxResults: 20,
    order: "date",
  });
};