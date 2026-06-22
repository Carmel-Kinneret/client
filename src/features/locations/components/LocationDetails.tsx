import React from 'react';
import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { Heart, Navigation, Copy } from 'lucide-react-native';
import { LocationPoint } from '../types';
import { useFavoritesStore } from '@/features/favorites/stores/useFavoritesStore';

interface LocationDetailsProps {
  location: LocationPoint | null;
}

export function LocationDetails({ location }: LocationDetailsProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  if (!location) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Select a location on the map to see details.</Text>
      </View>
    );
  }

  const favorite = isFavorite(location.id);

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View className="flex-1 px-5 pt-2 pb-6">
      {location.imageUrl && (
        <Image 
          source={{ uri: location.imageUrl }} 
          className="h-48 w-full rounded-2xl mb-5" 
          resizeMode="cover" 
        />
      )}
      
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 pr-4">
          <Text className="text-2xl font-bold text-gray-900 mb-1">{location.title}</Text>
          <View className="bg-blue-100 self-start px-3 py-1 rounded-full mb-3">
            <Text className="text-xs font-semibold text-blue-700">{location.category}</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => toggleFavorite(location.id)}
          className="p-2 bg-gray-100 rounded-full"
        >
          <Heart size={26} color={favorite ? '#ef4444' : '#6b7280'} fill={favorite ? '#ef4444' : 'transparent'} />
        </TouchableOpacity>
      </View>
      
      {location.description ? (
        <Text className="text-base text-gray-600 mb-6 leading-relaxed">
          {location.description}
        </Text>
      ) : null}

      <View className="flex-row gap-3 mt-auto pt-4">
        <TouchableOpacity 
          onPress={handleDirections}
          className="flex-1 flex-row items-center justify-center gap-2 bg-blue-600 py-3.5 rounded-xl active:bg-blue-700 shadow-sm"
        >
          <Navigation size={20} color="#ffffff" />
          <Text className="text-white font-semibold text-[15px]">Directions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center justify-center gap-2 bg-gray-100 py-3.5 px-5 rounded-xl active:bg-gray-200"
        >
          <Copy size={20} color="#4b5563" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
