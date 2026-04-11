/**
 * ClimaSync.AI — Social Posts API Service Layer
 */
import { apiClient } from "../apiClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface SocialPostData {
  social_post_id: string;
  event_id: string | null;
  content_text: string | null;
  content_image_url: string | null;
  video_url: string | null;
  status: string;
  created_by: string | null;
  created_by_type: string;
  scheduled_at: string | null;
  failed_reason: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  platforms: string[];
  engagement_views: number;
  engagement_likes: number;
  engagement_shares: number;
  engagement_comments: number;
}

export interface SocialPostCreate {
  content_text?: string;
  content_image_url?: string;
  video_url?: string;
  scheduled_at?: string;
  event_id?: string;
  platforms: string[];
}

// ---------------------------------------------------------------------------
// API Functions
// ---------------------------------------------------------------------------

export async function getSocialPosts(
  limit = 100,
  offset = 0
): Promise<SocialPostData[]> {
  const response = await apiClient.get<SocialPostData[]>(
    `/social?limit=${limit}&offset=${offset}`
  );
  return response.data;
}

export async function getSocialPostById(
  postId: string
): Promise<SocialPostData> {
  const response = await apiClient.get<SocialPostData>(`/social/${postId}`);
  return response.data;
}

export async function createSocialPost(
  payload: SocialPostCreate
): Promise<SocialPostData> {
  const response = await apiClient.post<SocialPostData>("/social", payload);
  return response.data;
}
