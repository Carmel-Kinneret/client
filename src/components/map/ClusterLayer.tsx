import { useMemo } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import type { LocationPoint } from '@/src/types/location';

type ClusterLayerProps = {
  locations: LocationPoint[];
  onClusterPress: (longitude: number, latitude: number, pointCount: number) => void;
  onPointPress: (location: LocationPoint) => void;
};

export function ClusterLayer({ locations, onClusterPress, onPointPress }: ClusterLayerProps) {
  const featureCollection = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: locations.map((location) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [location.longitude, location.latitude] as [number, number],
        },
        properties: {
          id: location.id,
          title: location.title,
          category: location.category,
        },
      })),
    }),
    [locations]
  );

  return (
    <MapLibreGL.ShapeSource
      id="locations-source"
      shape={featureCollection}
      cluster
      clusterRadius={48}
      onPress={(event) => {
        const feature = event.features?.[0];
        if (!feature) {
          return;
        }

        const clusterCount = Number(feature.properties?.point_count ?? 0);
        const coordinates = feature.geometry.coordinates as [number, number];

        if (clusterCount > 0) {
          onClusterPress(coordinates[0], coordinates[1], clusterCount);
          return;
        }

        const selectedLocation = locations.find((location) => location.id === feature.properties?.id);
        if (selectedLocation) {
          onPointPress(selectedLocation);
        }
      }}
    >
      <MapLibreGL.CircleLayer
        id="cluster-circles"
        filter={['has', 'point_count']}
        style={{
          circleColor: '#2563eb',
          circleRadius: ['step', ['get', 'point_count'], 22, 10, 28, 50, 36],
          circleOpacity: 0.92,
        }}
      />
      <MapLibreGL.SymbolLayer
        id="cluster-count"
        filter={['has', 'point_count']}
        style={{
          textField: ['get', 'point_count_abbreviated'],
          textSize: 13,
          textColor: '#ffffff',
          textAllowOverlap: true,
        }}
      />
      <MapLibreGL.CircleLayer
        id="unclustered-circles"
        filter={['!', ['has', 'point_count']]}
        style={{
          circleColor: '#38bdf8',
          circleRadius: 8,
          circleStrokeWidth: 2,
          circleStrokeColor: '#ffffff',
          circleOpacity: 0.95,
        }}
      />
    </MapLibreGL.ShapeSource>
  );
}