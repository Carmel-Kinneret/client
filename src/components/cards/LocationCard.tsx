import { Image, Pressable, View } from 'react-native';
import { MapPin, Route } from 'lucide-react-native';
import { Text } from '@/components/nativewindui/Text';
import { formatDistanceMeters } from '@/src/utils/geo';
import type { LocationPoint } from '@/src/types/location';
import { useColorScheme } from '@/lib/useColorScheme';

type LocationCardProps = {
  location: LocationPoint & { distanceMeters?: number };
  onPress: (location: LocationPoint) => void;
  selected?: boolean;
};

export function LocationCard({ location, onPress, selected = false }: LocationCardProps) {
  const { colors } = useColorScheme();

  return (
    <Pressable
      onPress={() => onPress(location)}
      className={selected ? 'rounded-3xl border border-primary bg-primary/10 p-4' : 'rounded-3xl border border-border bg-card p-4'}
      accessibilityRole="button"
      accessibilityLabel={`Open details for ${location.title}`}
    >
      <View className="flex-row gap-3">
        {location.image ? (
          <Image source={{ uri: location.image }} className="h-16 w-16 rounded-2xl bg-muted" />
        ) : (
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <MapPin size={22} color={colors.primary} />
          </View>
        )}
        <View className="flex-1 gap-1">
          <View className="flex-row items-start justify-between gap-2">
            <Text className="flex-1 text-[16px] font-semibold text-foreground">{location.title}</Text>
            {location.category ? (
              <View className="rounded-full bg-muted px-3 py-1">
                <Text className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{location.category}</Text>
              </View>
            ) : null}
          </View>
          {location.description ? <Text className="text-[13px] leading-5 text-muted-foreground">{location.description}</Text> : null}
          <View className="mt-1 flex-row items-center gap-2">
            <Route size={14} color={colors.mutedForeground} />
            <Text className="text-[12px] font-medium text-muted-foreground">{formatDistanceMeters(location.distanceMeters)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}