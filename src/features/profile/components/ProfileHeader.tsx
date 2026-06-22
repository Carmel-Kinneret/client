import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';

export const ProfileHeader = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Mock user data for now
  const user = {
    name: 'Yuval Hiker',
    username: '@yuvalhiker',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80',
    stats: {
      posts: 12,
      likes: 340,
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.userInfo}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View>
            <Text style={[styles.name, isDark && styles.textDark]}>{user.name}</Text>
            <Text style={[styles.username, isDark && styles.textDarkSecondary]}>{user.username}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.settingsButton, isDark && styles.settingsButtonDark]}
          onPress={() => router.push('/settings')}
          activeOpacity={0.7}
        >
          <Settings color={isDark ? '#9ca3af' : '#4b5563'} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDark && styles.textDark]}>{user.stats.posts}</Text>
          <Text style={[styles.statLabel, isDark && styles.textDarkSecondary]}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDark && styles.textDark]}>{user.stats.likes}</Text>
          <Text style={[styles.statLabel, isDark && styles.textDarkSecondary]}>Likes</Text>
        </View>
      </View>

      <View style={[styles.divider, isDark && styles.dividerDark]} />
      <Text style={[styles.sectionTitle, isDark && styles.textDark]}>My Posts</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  username: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonDark: {
    backgroundColor: '#374151',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statItem: {
    marginRight: 32,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 16,
  },
  dividerDark: {
    backgroundColor: '#374151',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  textDark: {
    color: '#f9fafb',
  },
  textDarkSecondary: {
    color: '#9ca3af',
  },
});
