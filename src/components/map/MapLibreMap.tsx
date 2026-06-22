import { useMemo } from 'react';
import { View } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import type { LocationPoint } from '@/src/types/location';
import type { MapCoordinate } from '@/src/types/map';
import type { NavigationRoute } from '@/src/types/navigation';
import { ClusterLayer } from './ClusterLayer';
import { MarkerLayer } from './MarkerLayer';

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

const MAP_STYLE = {
  light: 'https://demotiles.maplibre.org/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
} as const;

export function MapLibreMap({
  locations,
  selectedLocation,
  route,
  userLocation,
  followUser,
  cameraZoom,
  cameraTarget,
  isDarkMode,
  onPointPress,
  onClusterPress,
  onMapReady,
  onStyleLoaded,
  onMapTap,
}: MapLibreMapProps) {
  const initialCenterCoordinate = useMemo<[number, number]>(() => {
    if (cameraTarget) {
      return [cameraTarget.longitude, cameraTarget.latitude];
    }

    if (selectedLocation) {
      return [selectedLocation.longitude, selectedLocation.latitude];
    }

    if (userLocation) {
      return [userLocation.longitude, userLocation.latitude];
    }

    return [35.2137, 31.7683];
  }, [cameraTarget, selectedLocation, userLocation]);

  return (
    <View className="flex-1">
      <MapLibreGL.MapView
        style={{ flex: 1 }}
        styleURL={isDarkMode ? MAP_STYLE.dark : MAP_STYLE.light}
        compassEnabled
        logoEnabled={false}
        scaleBarEnabled={false}
        attributionEnabled={false}
        onDidFinishLoadingMap={onMapReady}
        onStyleLoaded={onStyleLoaded}
        onPress={onMapTap}
      >
        <MapLibreGL.Camera
          zoomLevel={cameraZoom}
          animationMode="flyTo"
          animationDuration={700}
          centerCoordinate={initialCenterCoordinate}
          followUserLocation={followUser}
          followZoomLevel={15}
        />
        <MapLibreGL.UserLocation visible showsUserHeadingIndicator />
        <ClusterLayer locations={locations} onClusterPress={onClusterPress} onPointPress={onPointPress} />
        <MarkerLayer selectedLocation={selectedLocation} />
        {route ? <RouteLine route={route} /> : null}
      </MapLibreGL.MapView>
    </View>
  );
}

type RouteLineProps = {
  route: NavigationRoute;
};

function RouteLine({ route }: RouteLineProps) {
  return (
    <MapLibreGL.ShapeSource
      id="navigation-route"
      shape={{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: route.coordinates,
        },
        properties: {
          distanceMeters: route.distanceMeters,
          durationSeconds: route.durationSeconds,
        },
      }}
    >
      <MapLibreGL.LineLayer
        id="navigation-route-line"
        style={{
          lineColor: '#22c55e',
          lineWidth: 5,
          lineJoin: 'round',
          lineCap: 'round',
          lineOpacity: 0.95,
        }}
      />
    </MapLibreGL.ShapeSource>
  );
}