import React from 'react';
import { FlatList, RefreshControl, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useUserPosts } from '@/features/posts/api/useUserPosts';
import { PostCard } from '@/features/posts/components/PostCard';
import { PostSkeleton } from '@/features/posts/components/PostSkeleton';
import { ProfileHeader } from './ProfileHeader';
import { Post } from '@/lib/api/types';

export const ProfilePostsFeed = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching
  } = useUserPosts(userId);

  const handleNavigateToMap = (lat: number, lon: number) => {
    router.push({
      pathname: '/(tabs)/',
      params: { lat: lat.toString(), lon: lon.toString() }
    });
  };

  const renderItem = ({ item }: { item: Post }) => (
    <PostCard post={item} onNavigateToMap={handleNavigateToMap} />
  );

  const posts = data?.pages.flatMap(page => page.posts) || [];

  if (isLoading) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <ProfileHeader />
        <PostSkeleton />
        <PostSkeleton />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={<ProfileHeader />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>You haven't posted anything yet.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListFooterComponent={
          isFetchingNextPage ? <PostSkeleton /> : <View style={{ height: 100 }} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyTextDark: {
    color: '#9ca3af',
  },
});
