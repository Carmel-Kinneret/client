import { View } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import type { LocationPoint } from '@/src/types/location';

type MarkerLayerProps = {
  selectedLocation: LocationPoint | null;
};

export function MarkerLayer({ selectedLocation }: MarkerLayerProps) {
  if (!selectedLocation) {
    return null;
  }

  return (
    <MapLibreGL.PointAnnotation
      id={`selected-${selectedLocation.id}`}
      coordinate={[selectedLocation.longitude, selectedLocation.latitude]}
    >
      <View className="items-center">
        <View className="h-8 w-8 rounded-full border-4 border-white bg-primary shadow-lg shadow-black/30" />
        <View className="-mt-1 h-3 w-3 rounded-full bg-primary/60" />
      </View>
    </MapLibreGL.PointAnnotation>
  );
}