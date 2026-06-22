import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { MapCoordinate } from '@/src/types/map';
import { useMapStore } from '@/src/store/mapStore';

type LocationPermissionState = 'unknown' | 'granted' | 'denied';

export function useCurrentLocation() {
  const setUserLocation = useMapStore((state) => state.setUserLocation);
  const setPermissionDenied = useMapStore((state) => state.setPermissionDenied);
  const [permissionState, setPermissionState] = useState<LocationPermissionState>('unknown');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let isMounted = true;

    async function bootstrapLocation() {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!isMounted) {
        return;
      }

      if (permission.status !== Location.PermissionStatus.GRANTED) {
        setPermissionState('denied');
        setPermissionDenied(true);
        setErrorMessage('Location permission is required to show your current position.');
        return;
      }

      setPermissionState('granted');
      setPermissionDenied(false);

      try {
        const initialLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!isMounted) {
          return;
        }

        setUserLocation(toCoordinate(initialLocation.coords), initialLocation.coords.heading ?? null);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 4000,
            distanceInterval: 10,
          },
          (update) => {
            if (!isMounted) {
              return;
            }

            setUserLocation(toCoordinate(update.coords), update.coords.heading ?? null);
          }
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error instanceof Error ? error.message : 'Failed to read the current location.');
      }
    }

    void bootstrapLocation();

    return () => {
      isMounted = false;
      void subscription?.remove();
    };
  }, [setPermissionDenied, setUserLocation]);

  return {
    permissionState,
    errorMessage,
  };
}

function toCoordinate(coords: Location.LocationObjectCoords): MapCoordinate {
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
}