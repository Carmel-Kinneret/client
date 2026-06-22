import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { ProfilePostsFeed } from '@/features/profile/components/ProfilePostsFeed';
import { GestureDetector, Gesture, Directions } from 'react-native-gesture-handler';

export default function ProfileScreen() {
  const router = useRouter();
  const isDark = useSettingsStore((state) => state.isDarkMode);

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .runOnJS(true)
    .onEnd(() => {
      router.navigate('/posts');
    });

  return (
    <GestureDetector gesture={flingRight}>
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
        <ProfilePostsFeed userId="user_123" />
      </SafeAreaView>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  containerDark: { backgroundColor: '#111827' },
});
