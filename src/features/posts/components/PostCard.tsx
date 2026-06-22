import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MapPin } from 'lucide-react-native';
import { Post } from '@/lib/api/types';
import { useLikePost } from '../api/usePosts';

interface PostCardProps {
  post: Post;
  onNavigateToMap: (lat: number, lon: number) => void;
}

export const PostCard = ({ post, onNavigateToMap }: PostCardProps) => {
  const { toggleLike } = useLikePost();

  const handleLike = () => {
    toggleLike(post);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {post.userAvatar ? (
          <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>{post.username?.[0]?.toUpperCase() || 'U'}</Text>
          </View>
        )}
        <View>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.timeAgo}>
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
          <Text style={styles.caption}>
            <Text style={styles.captionUsername}>{post.username} </Text>
            {post.caption}
          </Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, post.hasLiked && styles.actionButtonLiked]} 
            onPress={handleLike}
            activeOpacity={0.7}
          >
            <Heart 
              size={20} 
              color={post.hasLiked ? '#ef4444' : '#4b5563'} 
              fill={post.hasLiked ? '#ef4444' : 'transparent'} 
            />
            <Text style={[styles.actionText, post.hasLiked && styles.actionTextLiked]}>
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
  avatarInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9ca3af',
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
});
