import { useRef } from 'react';
import MapView from 'react-native-maps';

export function useMapCamera() {
  const mapRef = useRef<MapView>(null);

  const flyTo = (coordinates: [number, number], zoom: number = 15) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: coordinates[1],
        longitude: coordinates[0],
      },
      zoom,
    }, { duration: 1000 });
  };

  const fitBounds = (ne: [number, number], sw: [number, number]) => {
    mapRef.current?.fitToCoordinates([
      { latitude: ne[1], longitude: ne[0] },
      { latitude: sw[1], longitude: sw[0] },
    ], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
  };

  const resetBearing = () => {
    mapRef.current?.animateCamera({
      heading: 0,
      pitch: 0,
    }, { duration: 500 });
  };

  return {
    mapRef,
    flyTo,
    fitBounds,
    resetBearing,
  };
}
