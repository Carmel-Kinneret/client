import { useRef } from 'react';
import type * as MapLibreGLNamespace from '@maplibre/maplibre-react-native';

export function useMapCamera() {
  const cameraRef = useRef<MapLibreGLNamespace.CameraRef>(null);

  const flyTo = (coordinates: [number, number], zoom: number = 14) => {
    cameraRef.current?.flyTo({
      center: coordinates,
      zoom,
      duration: 1000,
    });
  };

  const fitBounds = (ne: [number, number], sw: [number, number], padding = 50) => {
    cameraRef.current?.fitBounds(
      [sw[0], sw[1], ne[0], ne[1]],
      {
        padding: { top: padding, right: padding, bottom: padding, left: padding },
        duration: 1000,
      }
    );
  };

  return {
    cameraRef,
    flyTo,
    fitBounds,
  };
}
