import type { ComponentType } from 'react';
import { Image, Share, View, Linking } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MapPin, Share2, Navigation, Map as MapIcon } from 'lucide-react-native';
import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import type { LocationPoint } from '@/src/types/location';
import type { MapCoordinate } from '@/src/types/map';
import { createGoogleMapsDeepLink, createShareText } from '@/src/services/navigationService';
import { formatCoordinate, formatDistanceMeters } from '@/src/utils/geo';
import { useColorScheme } from '@/lib/useColorScheme';

type BottomSheetContentProps = {
  location: LocationPoint;
  distanceMeters?: number;
  userLocation?: MapCoordinate | null;
  routeSummary?: string;
  onNavigate: () => void;
  onCenterMap: () => void;
  onClose: () => void;
};

export function BottomSheetContent({
  location,
  distanceMeters,
  userLocation,
  routeSummary,
  onNavigate,
  onCenterMap,
  onClose,
}: BottomSheetContentProps) {
  const { colors } = useColorScheme();

  async function handleShare() {
    await Share.share({
      message: createShareText(location),
      title: location.title,
    });
  }

  async function handleOpenGoogleMaps() {
    await Linking.openURL(createGoogleMapsDeepLink(location));
  }

  return (
    <BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 }}>
      <View className="gap-4">
        {location.image ? <Image source={{ uri: location.image }} className="h-48 w-full rounded-3xl bg-muted" /> : null}

        <View className="gap-2">
          <Text className="text-[22px] font-semibold text-foreground">{location.title}</Text>
          {location.description ? <Text className="text-[14px] leading-6 text-muted-foreground">{location.description}</Text> : null}
        </View>

        <View className="flex-row flex-wrap gap-2">
          <InfoPill icon={MapPin} color={colors.primary} label={formatCoordinate(location.latitude, location.longitude)} />
          <InfoPill icon={Navigation} color={colors.secondary} label={formatDistanceMeters(distanceMeters)} />
          {location.category ? <InfoPill icon={MapIcon} color={colors.mutedForeground} label={location.category} /> : null}
        </View>

        {routeSummary ? (
          <View className="rounded-3xl bg-primary/10 p-4">
            <Text className="text-[13px] font-semibold uppercase tracking-wide text-primary">Route</Text>
            <Text className="mt-1 text-[14px] text-foreground">{routeSummary}</Text>
          </View>
        ) : null}

        <View className="gap-2">
          <Button onPress={onNavigate} accessibilityLabel="Navigate to this point">
            <Text className="text-[15px] font-semibold text-white">Navigate</Text>
          </Button>
          <Button variant="secondary" onPress={onCenterMap} accessibilityLabel="Center map on this point">
            <Text className="text-[15px] font-semibold text-foreground">Center on map</Text>
          </Button>
          <Button variant="tonal" onPress={handleShare} accessibilityLabel="Share this point">
            <Text className="text-[15px] font-semibold text-foreground">Share</Text>
          </Button>
          <Button variant="plain" onPress={handleOpenGoogleMaps} accessibilityLabel="Open in Google Maps">
            <Text className="text-[15px] font-semibold text-foreground">Open in Google Maps</Text>
          </Button>
          <Button variant="plain" onPress={onClose} accessibilityLabel="Close details sheet">
            <Text className="text-[15px] font-semibold text-foreground">Close</Text>
          </Button>
        </View>

        {userLocation ? (
          <Text className="pt-2 text-[12px] text-muted-foreground">
            Your location: {formatCoordinate(userLocation.latitude, userLocation.longitude)}
          </Text>
        ) : null}
      </View>
    </BottomSheetScrollView>
  );
}

type InfoPillProps = {
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  color: string;
};

function InfoPill({ icon: Icon, label, color }: InfoPillProps) {
  return (
    <View className="flex-row items-center gap-2 rounded-full bg-muted px-3 py-2">
      <Icon size={14} color={color} />
      <Text className="text-[12px] font-medium text-muted-foreground">{label}</Text>
    </View>
  );
}