import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { useMapStore } from '../stores/useMapStore';

export function useUserLocation() {
  const setUserLocation = useMapStore((s) => s.setUserLocation);
  const setUserHeading = useMapStore((s) => s.setUserHeading);

  useEffect(() => {
    let locationSubscription: { remove: () => void } | null = null;
    let headingSubscription: { remove: () => void } | null = null;

    async function startTracking() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          return;
        }

        // Start watching position
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (location) => {
            setUserLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        );

        // Start watching heading
        headingSubscription = await Location.watchHeadingAsync((headingData) => {
          // trueHeading is preferred, fallback to magHeading
          const heading = headingData.trueHeading >= 0 ? headingData.trueHeading : headingData.magHeading;
          setUserHeading(heading);
        });
      } catch (err) {
        console.error('Error starting location/heading tracking:', err);
      }
    }

    if (Platform.OS !== 'web') {
      startTracking();
    } else {
      // Web Geolocation
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.warn('Web Geolocation error:', error);
          },
          { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
        );

        // Web Heading (Device Orientation)
        const handleOrientation = (event: DeviceOrientationEvent) => {
          let heading: number | null = null;
          if ('webkitCompassHeading' in event) {
            heading = (event as any).webkitCompassHeading;
          } else if (event.alpha !== null) {
            // alpha is 0 to 360, compass heading is 360 - alpha for standard orientation
            heading = (360 - event.alpha) % 360;
          }
          if (heading !== null) {
            setUserHeading(heading);
          }
        };

        if (typeof window !== 'undefined') {
          const win = window as any;
          if ('ondeviceorientationabsolute' in win) {
            win.addEventListener('deviceorientationabsolute', handleOrientation);
          } else if ('ondeviceorientation' in win) {
            win.addEventListener('deviceorientation', handleOrientation);
          }
        }

        return () => {
          navigator.geolocation.clearWatch(watchId);
          if (typeof window !== 'undefined') {
            const win = window as any;
            win.removeEventListener('deviceorientationabsolute', handleOrientation);
            win.removeEventListener('deviceorientation', handleOrientation);
          }
        };
      }
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      if (headingSubscription) {
        headingSubscription.remove();
      }
    };
  }, [setUserLocation, setUserHeading]);
}
