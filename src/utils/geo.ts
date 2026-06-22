import type { LocationPoint } from '@/src/types/location';

export function haversineDistanceMeters(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
): number {
  const earthRadiusMeters = 6371000;
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);

  const a =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(originLatitude) * Math.cos(destinationLatitude) * Math.sin(longitudeDelta / 2) * Math.sin(longitudeDelta / 2);

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistanceMeters(distanceMeters?: number): string {
  if (!distanceMeters || !Number.isFinite(distanceMeters)) {
    return 'Distance unavailable';
  }

  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }

  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

export function formatCoordinate(latitude: number, longitude: number): string {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

export function pointsToCoordinateBounds(points: LocationPoint[]): [number, number][] {
  return points.map((point) => [point.longitude, point.latitude]);
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}