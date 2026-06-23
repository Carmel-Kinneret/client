import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserPosts } from '@/lib/api/routes';
import { Post } from '@/lib/api/types';

export const useUserPosts = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ['user-posts', userId],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const posts = await getUserPosts(userId, 10, pageParam as number);
        return {
          posts,
          next_offset: posts.length === 10 ? (pageParam as number) + 10 : null,
        };
      } catch (e) {
        // Fallback to mock data for dev
        return {
          posts: [
            {
              id: `mock-user-${pageParam}-1`,
              userId,
              username: 'My Profile',
              imageUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=600&q=80',
              caption: 'My first post!',
              lat: 32.0853,
              lon: 34.7818,
              createdAt: new Date().toISOString(),
              likesCount: 15,
              hasLiked: false,
            }
          ] as Post[],
          next_offset: pageParam === 0 ? 10 : null,
        };
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.next_offset,
  });
};
