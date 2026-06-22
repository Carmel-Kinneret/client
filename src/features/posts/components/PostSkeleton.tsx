import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export const PostSkeleton = () => {
  const animatedValue = new Animated.Value(0.3);

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

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Animated.View style={[styles.avatar, { opacity: animatedValue }]} />
        <Animated.View style={[styles.name, { opacity: animatedValue }]} />
      </View>
      <Animated.View style={[styles.image, { opacity: animatedValue }]} />
      <View style={styles.footer}>
        <Animated.View style={[styles.captionLine, { opacity: animatedValue }]} />
        <Animated.View style={[styles.captionLineShort, { opacity: animatedValue }]} />
        <View style={styles.actions}>
          <Animated.View style={[styles.actionButton, { opacity: animatedValue }]} />
          <Animated.View style={[styles.actionButton, { opacity: animatedValue }]} />
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
    // shadow for the card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 12,
  },
  name: {
    height: 16,
    width: 120,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#e5e7eb',
  },
  footer: {
    padding: 16,
  },
  captionLine: {
    height: 14,
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 8,
  },
  captionLineShort: {
    height: 14,
    width: '60%',
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    height: 36,
    width: 80,
    backgroundColor: '#e5e7eb',
    borderRadius: 18,
  },
});
