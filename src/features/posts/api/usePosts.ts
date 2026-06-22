import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getPosts, GetPostsParams, likePost, unlikePost } from '@/lib/api/routes';
import { Post } from '@/lib/api/types';

export const usePosts = (params: Omit<GetPostsParams, 'limit' | 'offset'> = {}) => {
  return useInfiniteQuery({
    queryKey: ['posts', params],
    queryFn: async ({ pageParam = 0 }) => {
      // Mocked response if API is not running, 
      // Replace with `return getPosts({ ...params, offset: pageParam as number, limit: 10 });` in production.
      try {
        const response = await getPosts({ ...params, offset: pageParam as number, limit: 10 });
        return response;
      } catch (e) {
        // Fallback to mock data to ensure UI is visible during development without backend
        return {
          posts: [
            {
              id: `mock-${pageParam}-1`,
              userId: 'user-1',
              username: 'HikerDave',
              imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80',
              caption: 'Amazing views from the top of the trail today! Perfect weather for a hike. 🥾🌲',
              lat: 32.0853,
              lon: 34.7818,
              createdAt: new Date().toISOString(),
              likesCount: 124,
              hasLiked: false,
            },
            {
              id: `mock-${pageParam}-2`,
              userId: 'user-2',
              username: 'SarahExplorer',
              userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
              imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
              caption: 'Found this hidden gem near the lake. highly recommend!',
              lat: 32.0910,
              lon: 34.7860,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              likesCount: 89,
              hasLiked: true,
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

export const useLikePost = () => {
  const queryClient = useQueryClient();

  const toggleLike = async (post: Post) => {
    // Optimistic update
    queryClient.setQueryData(['posts', {}], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((p: Post) => {
            if (p.id === post.id) {
              return {
                ...p,
                hasLiked: !p.hasLiked,
                likesCount: p.hasLiked ? p.likesCount - 1 : p.likesCount + 1,
              };
            }
            return p;
          }),
        })),
      };
    });

    try {
      if (post.hasLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    } catch (error) {
      console.error('Failed to toggle like', error);
      // Revert in real app
    }
  };

  return { toggleLike };
};
