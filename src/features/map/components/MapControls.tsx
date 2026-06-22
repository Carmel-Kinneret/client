import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Compass, LocateFixed } from 'lucide-react-native';

interface MapControlsProps {
  onLocateUser: () => void;
  onResetBearing: () => void;
}

export function MapControls({ onLocateUser, onResetBearing }: MapControlsProps) {
  return (
    <View className="absolute right-4 top-1/3 flex flex-col gap-3">
      <TouchableOpacity
        onPress={onLocateUser}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md active:bg-gray-100"
        activeOpacity={0.7}
      >
        <LocateFixed size={22} color="#3b82f6" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onResetBearing}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md active:bg-gray-100"
        activeOpacity={0.7}
      >
        <Compass size={22} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );
}
