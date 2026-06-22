import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MapLibreGL, isMapLibreSupported } from '../utils/mapLibreLoader';
import { LocationPoint } from '@/features/locations/types';
import { useMapCamera } from '../hooks/useMapCamera';
import { useMapStore } from '../stores/useMapStore';

interface MapViewProps {
  locations: LocationPoint[];
}

export default function MapView({ locations }: MapViewProps) {
  const { cameraRef, flyTo } = useMapCamera();
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);

  // Fallback for users trying to run the app in Expo Go without native modules
  if (!isMapLibreSupported || !MapLibreGL) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ef4444', textAlign: 'center' }}>
          MapLibre Native Module Missing!
        </Text>
        <Text style={{ fontSize: 15, color: '#374151', textAlign: 'center', marginTop: 10 }}>
          This app uses custom native code for mapping and storage that is not supported by the standard Expo Go app. 
          Please compile a custom dev client using `npx expo run:android` or `npx eas build`.
        </Text>
      </View>
    );
  }

  const MapLibre = MapLibreGL;

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
      <MapLibre.Map
        style={styles.map}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        logo={false}
        attribution={true}
        attributionPosition={{ bottom: 8, right: 8 }}
      >
        <MapLibre.Camera ref={cameraRef} zoom={6} center={[34.8, 31.0]} />
        <MapLibre.UserLocation />

        <MapLibre.GeoJSONSource
          id="locations"
          data={geojsonData}
          cluster={true}
          clusterRadius={50}
          clusterMaxZoom={14}
          onPress={handleMapPress}
        >
          {/* Cluster Circles Layer */}
          <MapLibre.Layer
            id="clusters"
            type="circle"
            filter={['has', 'point_count']}
            style={{
              circleColor: '#3b82f6',
              circleRadius: ['step', ['get', 'point_count'], 15, 10, 20, 50, 25],
              circleStrokeWidth: 2,
              circleStrokeColor: '#ffffff',
            }}
          />

          {/* Cluster Point Counts */}
          <MapLibre.Layer
            id="cluster-count"
            type="symbol"
            filter={['has', 'point_count']}
            style={{
              textField: '{point_count_abbreviated}',
              textSize: 12,
              textColor: '#ffffff',
              textPitchAlignment: 'map',
            }}
          />

          {/* Unclustered Points Layer */}
          <MapLibre.Layer
            id="unclustered-point"
            type="circle"
            filter={['!', ['has', 'point_count']]}
            style={{
              circleColor: '#ef4444',
              circleRadius: 8,
              circleStrokeWidth: 2,
              circleStrokeColor: '#ffffff',
            }}
          />
        </MapLibre.GeoJSONSource>
      </MapLibre.Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  map: { flex: 1 },
});
