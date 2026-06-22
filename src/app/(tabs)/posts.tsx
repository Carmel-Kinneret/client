import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { PostsFeed } from '@/features/posts/components/PostsFeed';
import { GestureDetector, Gesture, Directions } from 'react-native-gesture-handler';

export default function PostsScreen() {
  const router = useRouter();
  const isDark = useSettingsStore((state) => state.isDarkMode);

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .runOnJS(true)
    .onEnd(() => {
      router.navigate('/');
    });

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .runOnJS(true)
    .onEnd(() => {
      router.navigate('/me');
    });

  const gestures = Gesture.Exclusive(flingRight, flingLeft);

  return (
    <GestureDetector gesture={gestures}>
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
        <PostsFeed />
      </SafeAreaView>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  containerDark: { backgroundColor: '#111827' },
});
