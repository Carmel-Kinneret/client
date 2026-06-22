import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { LocationPoint } from '@/features/locations/types';
import { useMapCamera } from '../hooks/useMapCamera';
import { useMapStore } from '../stores/useMapStore';

MapLibreGL.setAccessToken(null);

interface MapViewProps {
  locations: LocationPoint[];
}

export default function MapView({ locations }: MapViewProps) {
  const { cameraRef, flyTo } = useMapCamera();
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);

  // Convert locations to GeoJSON FeatureCollection
  const geojsonData = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: locations.map((loc) => ({
        type: 'Feature' as const,
        id: loc.id,
        geometry: {
          type: 'Point' as const,
          coordinates: [loc.longitude, loc.latitude],
        },
        properties: {
          id: loc.id,
          category: loc.category,
        },
      })),
    }),
    [locations]
  );

  const handleMapPress = (e: any) => {
    const feature = e.features?.[0];
    if (feature) {
      if (feature.properties?.cluster) {
        // Handle cluster press (e.g. zoom in)
        const coords = feature.geometry.coordinates;
        flyTo([coords[0], coords[1]], 12); // zoom in slightly to expand cluster
      } else {
        // Handle individual point press
        const locationId = feature.properties?.id;
        const loc = locations.find((l) => l.id === locationId);
        if (loc) {
          setSelectedLocation(loc);
          flyTo([loc.longitude, loc.latitude], 15);
        }
      }
    } else {
      setSelectedLocation(null);
    }
  };

  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        style={styles.map}
        styleURL="https://tiles.openfreemap.org/styles/liberty"
        logoEnabled={false}
        attributionEnabled={true}
        attributionPosition={{ bottom: 8, right: 8 }}
      >
        <MapLibreGL.Camera ref={cameraRef} zoomLevel={6} centerCoordinate={[34.8, 31.0]} />
        <MapLibreGL.UserLocation visible={true} />

        <MapLibreGL.ShapeSource
          id="locations"
          shape={geojsonData}
          cluster={true}
          clusterRadius={50}
          clusterMaxZoom={14}
          onPress={handleMapPress}
        >
          {/* Cluster Circles Layer */}
          <MapLibreGL.CircleLayer
            id="clusters"
            filter={['has', 'point_count']}
            style={{
              circleColor: '#3b82f6',
              circleRadius: ['step', ['get', 'point_count'], 15, 10, 20, 50, 25],
              circleStrokeWidth: 2,
              circleStrokeColor: '#ffffff',
            }}
          />

          {/* Cluster Point Counts */}
          <MapLibreGL.SymbolLayer
            id="cluster-count"
            filter={['has', 'point_count']}
            style={{
              textField: '{point_count_abbreviated}',
              textSize: 12,
              textColor: '#ffffff',
              textPitchAlignment: 'map',
            }}
          />

          {/* Unclustered Points Layer */}
          <MapLibreGL.CircleLayer
            id="unclustered-point"
            filter={['!', ['has', 'point_count']]}
            style={{
              circleColor: '#ef4444',
              circleRadius: 8,
              circleStrokeWidth: 2,
              circleStrokeColor: '#ffffff',
            }}
          />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  map: { flex: 1 },
});
