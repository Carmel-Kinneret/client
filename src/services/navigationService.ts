import type { LocationPoint } from '@/src/types/location';
import type { MapCoordinate } from '@/src/types/map';
import type { NavigationRoute } from '@/src/types/navigation';
import { haversineDistanceMeters } from '@/src/utils/geo';

type OsmRouteResponse = {
  routes?: Array<{
    distance: number;
    duration: number;
    geometry: {
      coordinates: Array<[number, number]>;
    };
    legs?: Array<{
      steps?: Array<{
        maneuver?: {
          instruction?: string;
          location?: [number, number];
        };
        distance?: number;
        duration?: number;
      }>;
    }>;
  }>;
};

export async function fetchNavigationRoute(origin: MapCoordinate, destination: MapCoordinate): Promise<NavigationRoute> {
  const url = buildRoutingUrl(origin, destination);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Routing request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as OsmRouteResponse;
    const route = payload.routes?.[0];

    if (!route) {
      return createFallbackRoute(origin, destination);
    }

    return {
      distanceMeters: route.distance,
      durationSeconds: route.duration,
      coordinates: route.geometry.coordinates,
      instructions:
        route.legs?.[0]?.steps?.map((step, index) => ({
          id: `instruction-${index}`,
          title: step.maneuver?.instruction ?? 'Continue',
          distanceMeters: step.distance ?? 0,
          durationSeconds: step.duration ?? 0,
          coordinate: {
            latitude: step.maneuver?.location?.[1] ?? destination.latitude,
            longitude: step.maneuver?.location?.[0] ?? destination.longitude,
          },
        })) ?? [],
    };
  } catch {
    return createFallbackRoute(origin, destination);
  }
}

export function createGoogleMapsDeepLink(destination: LocationPoint): string {
  const coordinate = `${destination.latitude},${destination.longitude}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coordinate)}&travelmode=driving`;
}

export function createShareText(destination: LocationPoint): string {
  return `${destination.title} • ${destination.latitude.toFixed(5)}, ${destination.longitude.toFixed(5)}`;
}

function buildRoutingUrl(origin: MapCoordinate, destination: MapCoordinate): string {
  return `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson&steps=true`;
}

function createFallbackRoute(origin: MapCoordinate, destination: MapCoordinate): NavigationRoute {
  const distanceMeters = haversineDistanceMeters(origin, destination);

  return {
    distanceMeters,
    durationSeconds: Math.max(distanceMeters / 12, 60),
    coordinates: [
      [origin.longitude, origin.latitude],
      [destination.longitude, destination.latitude],
    ],
    instructions: [
      {
        id: 'fallback-1',
        title: 'Head toward the destination',
        distanceMeters,
        durationSeconds: Math.max(distanceMeters / 12, 60),
        coordinate: destination,
      },
    ],
  };
}