import { View } from 'react-native';
import { Text } from '@/components/nativewindui/Text';

export function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-[24px] font-semibold text-foreground">Profile</Text>
      <Text className="mt-2 text-center text-[14px] leading-6 text-muted-foreground">
        Settings, saved maps, and map preferences can live here without touching the map feature slice.
      </Text>
    </View>
  );
}