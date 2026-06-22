import { fetchClient } from './client';
import type { TrailSection, POI, Post, PaginatedPosts, LikeResponse } from './types';

// 1. Map & Core Domain
export const getTrails = () => fetchClient<TrailSection[]>('/trails');

export const getPois = (type?: 'MAIN' | 'EVENT') => {
  const url = type ? `/pois?type=${type}` : '/pois';
  return fetchClient<POI[]>(url);
};

// 2. Feed & User Posts
export interface GetPostsParams {
  min_lat?: number;
  max_lat?: number;
  min_lon?: number;
  max_lon?: number;
  limit?: number;
  offset?: number;
}

export const getPosts = (params: GetPostsParams = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.append(key, value.toString());
  });
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return fetchClient<PaginatedPosts>(`/posts${queryString}`);
};

export const createPost = (data: { imageUrl: string; caption?: string; lat: number; lon: number }) =>
  fetchClient<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getUserPosts = (userId: string, limit?: number, offset?: number) => {
  const query = new URLSearchParams();
  if (limit) query.append('limit', limit.toString());
  if (offset) query.append('offset', offset.toString());
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return fetchClient<Post[]>(`/users/${userId}/posts${queryString}`);
};

// 3. Interactivity (Likes)
export const likePost = (postId: string) =>
  fetchClient<LikeResponse>(`/posts/${postId}/like`, { method: 'POST' });

export const unlikePost = (postId: string) =>
  fetchClient<LikeResponse>(`/posts/${postId}/like`, { method: 'DELETE' });

// 4. Admin & Moderation
export const adminUpdatePost = (postId: string, isActive: boolean) =>
  fetchClient<Post>(`/admin/posts/${postId}`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });

export const adminUpdatePoi = (poiId: string, isActive: boolean) =>
  fetchClient<POI>(`/admin/pois/${poiId}`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });

export const adminCreatePoi = (data: { title: string; type: 'EVENT'; imageUrl?: string; lat: number; lon: number; metadata: any }) =>
  fetchClient<POI>('/admin/pois', {
    method: 'POST',
    body: JSON.stringify(data),
  });
