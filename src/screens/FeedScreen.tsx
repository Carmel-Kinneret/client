import { View } from 'react-native';
import { Text } from '@/components/nativewindui/Text';

export function FeedScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-[24px] font-semibold text-foreground">Community feed</Text>
      <Text className="mt-2 text-center text-[14px] leading-6 text-muted-foreground">
        This tab is reserved for shared trail updates, saved locations, and route notes.
      </Text>
    </View>
  );
}