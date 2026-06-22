import { View } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { Text } from '@/components/nativewindui/Text';
import type { LocationPoint } from '@/src/types/location';
import type { MapCoordinate } from '@/src/types/map';
import type { NavigationRoute } from '@/src/types/navigation';

type MapLibreMapProps = {
  locations: LocationPoint[];
  selectedLocation: LocationPoint | null;
  route: NavigationRoute | null;
  userLocation: MapCoordinate | null;
  followUser: boolean;
  cameraZoom: number;
  cameraTarget: MapCoordinate | null;
  isDarkMode: boolean;
  onPointPress: (location: LocationPoint) => void;
  onClusterPress: (longitude: number, latitude: number, pointCount: number) => void;
  onMapReady: () => void;
  onStyleLoaded: () => void;
  onMapTap: () => void;
};

export function MapLibreMap({ locations, selectedLocation, route, userLocation, followUser }: MapLibreMapProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <View className="absolute inset-0 overflow-hidden">
        <View className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <View className="absolute -right-16 top-28 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
        <View className="absolute bottom-12 left-1/4 h-52 w-52 rounded-full bg-accent/10 blur-3xl" />
      </View>

      <View className="w-full max-w-[520px] gap-4 rounded-[32px] border border-border bg-card p-5 shadow-2xl shadow-black/15">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
            <MapPin size={20} color="rgb(59, 130, 246)" />
          </View>
          <View className="flex-1">
            <Text className="text-[18px] font-semibold text-foreground">MapLibre native view</Text>
            <Text className="text-[13px] text-muted-foreground">The full interactive map runs in the mobile build.</Text>
          </View>
        </View>

        <View className="rounded-3xl border border-dashed border-border bg-background/70 p-4">
          <Text className="text-[14px] font-semibold text-foreground">Web preview</Text>
          <Text className="mt-1 text-[13px] leading-5 text-muted-foreground">
            {locations.length} locations loaded{selectedLocation ? `, focused on ${selectedLocation.title}` : ''}
            {followUser ? ', follow mode is on.' : '.'}
          </Text>
          {userLocation ? (
            <Text className="mt-2 text-[12px] text-muted-foreground">
              Current location: {userLocation.latitude.toFixed(5)}, {userLocation.longitude.toFixed(5)}
            </Text>
          ) : null}
          {route ? (
            <Text className="mt-2 text-[12px] text-muted-foreground">
              Route ready: {Math.max(Math.round(route.durationSeconds / 60), 1)} min • {Math.round(route.distanceMeters)} m
            </Text>
          ) : null}
        </View>

        <View className="flex-row items-center gap-2 rounded-2xl bg-primary/10 px-4 py-3">
          <Navigation size={16} color="rgb(59, 130, 246)" />
          <Text className="flex-1 text-[13px] text-foreground">Use the Expo development build to access the MapLibre map, clustering, and location controls.</Text>
        </View>
      </View>
    </View>
  );
}