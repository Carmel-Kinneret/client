import { useRef } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';

export function useMapCamera() {
  const cameraRef = useRef<MapLibreGL.Camera>(null);

  const flyTo = (coordinates: [number, number], zoomLevel: number = 14) => {
    cameraRef.current?.setCamera({
      centerCoordinate: coordinates,
      zoomLevel,
      animationDuration: 1000,
    });
  };

  const fitBounds = (ne: [number, number], sw: [number, number], padding = 50) => {
    cameraRef.current?.fitBounds(ne, sw, padding, 1000);
  };

  return {
    cameraRef,
    flyTo,
    fitBounds,
  };
}
