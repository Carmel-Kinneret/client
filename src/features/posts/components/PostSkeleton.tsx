import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useSettingsStore } from '@/lib/store/useSettingsStore';

export const PostSkeleton = () => {
  const animatedValue = new Animated.Value(0.3);
  const isDark = useSettingsStore((state) => state.isDarkMode);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const placeholderColor = isDark ? '#374151' : '#e5e7eb';

  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <View style={styles.header}>
        <Animated.View style={[styles.avatar, { opacity: animatedValue, backgroundColor: placeholderColor }]} />
        <Animated.View style={[styles.name, { opacity: animatedValue, backgroundColor: placeholderColor }]} />
      </View>
      <Animated.View style={[styles.image, { opacity: animatedValue, backgroundColor: placeholderColor }]} />
      <View style={styles.footer}>
        <Animated.View style={[styles.captionLine, { opacity: animatedValue, backgroundColor: placeholderColor }]} />
        <Animated.View style={[styles.captionLineShort, { opacity: animatedValue, backgroundColor: placeholderColor }]} />
        <View style={styles.actions}>
          <Animated.View style={[styles.actionButton, { opacity: animatedValue, backgroundColor: placeholderColor }]} />
          <Animated.View style={[styles.actionButton, { opacity: animatedValue, backgroundColor: placeholderColor }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginHorizontal: 16,
  },
  cardDark: {
    backgroundColor: '#1f2937',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 12,
  },
  name: {
    height: 16,
    width: 120,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 300,
  },
  footer: {
    padding: 16,
  },
  captionLine: {
    height: 14,
    width: '100%',
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
  captionLineShort: {
    height: 14,
    width: '60%',
    borderRadius: 6,
    marginBottom: 16,
    alignSelf: 'flex-end',
  },
  actions: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    height: 36,
    width: 80,
    borderRadius: 18,
  },
});
