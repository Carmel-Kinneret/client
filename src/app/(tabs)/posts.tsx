import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostsFeed } from '@/features/posts/components/PostsFeed';

export default function PostsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PostsFeed />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
});
