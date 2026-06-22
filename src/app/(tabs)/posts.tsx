import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { PostsFeed } from '@/features/posts/components/PostsFeed';

export default function PostsScreen() {
  const isDark = useSettingsStore((state) => state.isDarkMode);

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
      <PostsFeed />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  containerDark: { backgroundColor: '#111827' },
});
