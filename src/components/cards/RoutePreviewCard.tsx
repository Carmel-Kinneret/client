import { View } from 'react-native';
import { Navigation2 } from 'lucide-react-native';
import { Text } from '@/components/nativewindui/Text';
import { Button } from '@/components/nativewindui/Button';
import type { NavigationRoute } from '@/src/types/navigation';
import { formatDistanceMeters } from '@/src/utils/geo';
import { useColorScheme } from '@/lib/useColorScheme';

type RoutePreviewCardProps = {
  route: NavigationRoute;
  onNavigate: () => void;
  onStop: () => void;
};

export function RoutePreviewCard({ route, onNavigate, onStop }: RoutePreviewCardProps) {
  const { colors } = useColorScheme();

  return (
    <View className="gap-3 rounded-3xl border border-border bg-card p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/15">
          <Navigation2 size={18} color={colors.primary} />
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-semibold text-foreground">Navigation preview</Text>
          <Text className="text-[13px] text-muted-foreground">
            {formatDistanceMeters(route.distanceMeters)} • {Math.max(Math.round(route.durationSeconds / 60), 1)} min
          </Text>
        </View>
      </View>
      <View className="flex-row gap-2">
        <Button onPress={onNavigate} className="flex-1" accessibilityLabel="Start navigation">
          <Text className="text-[15px] font-semibold text-white">Start</Text>
        </Button>
        <Button variant="secondary" onPress={onStop} className="flex-1" accessibilityLabel="Stop navigation">
          <Text className="text-[15px] font-semibold text-foreground">Stop</Text>
        </Button>
      </View>
    </View>
  );
}