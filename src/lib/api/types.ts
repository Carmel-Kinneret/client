export interface TrailSection {
  id: string;
  orderIndex: number;
  geojson: any; // GeoJSON LineString
}

export interface POI {
  id: string;
  title: string;
  type: 'MAIN' | 'EVENT';
  imageUrl?: string;
  lat: number;
  lon: number;
  metadata: any;
  isActive: boolean;
}

export interface Post {
  id: string;
  userId: string;
  username: string; // added for UI
  userAvatar?: string; // added for UI
  imageUrl: string;
  caption?: string;
  lat: number;
  lon: number;
  createdAt: string;
  likesCount: number;
  hasLiked?: boolean;
}

export interface PaginatedPosts {
  posts: Post[];
  next_offset: number | null;
}

export interface LikeResponse {
  success: boolean;
  totalLikes: number;
}
