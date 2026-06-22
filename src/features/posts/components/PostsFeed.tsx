import React, { useState } from 'react';
import { FlatList, RefreshControl, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { usePosts } from '../api/usePosts';
import { PostCard } from './PostCard';
import { PostsFilter } from './PostsFilter';
import { PostSkeleton } from './PostSkeleton';
import { Post } from '@/lib/api/types';

export const PostsFeed = () => {
  const router = useRouter();
  const [filter, setFilter] = useState('recent');
  
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching
  } = usePosts(); // Could pass { sort: filter } to usePosts in the future

  const handleNavigateToMap = (lat: number, lon: number) => {
    // Navigate back to the map screen and pass parameters
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
      <View style={styles.container}>
        <PostsFilter selectedId={filter} onSelect={setFilter} />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <PostsFilter selectedId={filter} onSelect={setFilter} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts found.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListFooterComponent={
          isFetchingNextPage ? <PostSkeleton /> : <View style={{ height: 100 }} /> // Spacer for the tab bar
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // Lightest gray for whitespace feeling
  },
  listContent: {
    paddingTop: 8,
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
});
