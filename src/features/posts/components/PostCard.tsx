import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MapPin } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Post } from '@/lib/api/types';
import { useLikePost } from '../api/usePosts';

interface PostCardProps {
  post: Post;
  onNavigateToMap: (lat: number, lon: number) => void;
}

export const PostCard = ({ post, onNavigateToMap }: PostCardProps) => {
  const { toggleLike } = useLikePost();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLike = () => {
    toggleLike(post);
  };

  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <View style={styles.header}>
        {post.userAvatar ? (
          <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder, isDark && styles.avatarPlaceholderDark]}>
            <Text style={[styles.avatarInitial, isDark && styles.avatarInitialDark]}>{post.username?.[0]?.toUpperCase() || 'U'}</Text>
          </View>
        )}
        <View>
          <Text style={[styles.username, isDark && styles.textDark]}>{post.username}</Text>
          <Text style={[styles.timeAgo, isDark && styles.timeAgoDark]}>
            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </Text>
        </View>
      </View>

      <Image 
        source={{ uri: post.imageUrl }} 
        style={styles.image} 
        resizeMode="cover" 
      />

      <View style={styles.footer}>
        {post.caption && (
          <Text style={[styles.caption, isDark && styles.textDarkSecondary]}>
            <Text style={[styles.captionUsername, isDark && styles.textDark]}>{post.username} </Text>
            {post.caption}
          </Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, isDark && styles.actionButtonDark, post.hasLiked && styles.actionButtonLiked]} 
            onPress={handleLike}
            activeOpacity={0.7}
          >
            <Heart 
              size={20} 
              color={post.hasLiked ? '#ef4444' : isDark ? '#9ca3af' : '#4b5563'} 
              fill={post.hasLiked ? '#ef4444' : 'transparent'} 
            />
            <Text style={[styles.actionText, isDark && styles.textDarkSecondary, post.hasLiked && styles.actionTextLiked]}>
              {post.likesCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mapButton} 
            onPress={() => onNavigateToMap(post.lat, post.lon)}
            activeOpacity={0.7}
          >
            <MapPin size={18} color="#ffffff" />
            <Text style={styles.mapButtonText}>View on Map</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderDark: {
    backgroundColor: '#374151',
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  avatarInitialDark: {
    color: '#d1d5db',
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  timeAgo: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  timeAgoDark: {
    color: '#6b7280',
  },
  image: {
    width: '100%',
    height: 350,
  },
  footer: {
    padding: 16,
  },
  caption: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  captionUsername: {
    fontWeight: '600',
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  actionButtonDark: {
    backgroundColor: '#374151',
  },
  actionButtonLiked: {
    backgroundColor: '#fef2f2',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  actionTextLiked: {
    color: '#ef4444',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  mapButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  textDark: {
    color: '#f9fafb',
  },
  textDarkSecondary: {
    color: '#d1d5db',
  },
});
