import type { LocationPoint } from '@/src/types/location';

const COORDINATE_PATTERNS = [
  /@(?<latitude>-?\d+(?:\.\d+)?),(?<longitude>-?\d+(?:\.\d+)?)/g,
  /!3d(?<latitude>-?\d+(?:\.\d+)?)!4d(?<longitude>-?\d+(?:\.\d+)?)/g,
  /(?:[?&](?:q|query|ll)=)(?<latitude>-?\d+(?:\.\d+)?),(?<longitude>-?\d+(?:\.\d+)?)/g,
  /(?<latitude>-?\d+(?:\.\d+)?),\s*(?<longitude>-?\d+(?:\.\d+)?)/g,
];

export class GoogleMapsLinkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GoogleMapsLinkError';
  }
}

export function parseGoogleMapsLink(rawLink: string, fallbackLabel?: string): LocationPoint[] {
  const normalizedLink = rawLink.trim();

  if (!normalizedLink) {
    throw new GoogleMapsLinkError('Provide a Google Maps link or text containing coordinates.');
  }

  const seenCoordinates = new Set<string>();
  const points: LocationPoint[] = [];

  for (const pattern of COORDINATE_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(normalizedLink)) !== null) {
      const latitude = Number(match.groups?.latitude);
      const longitude = Number(match.groups?.longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        continue;
      }

      const key = `${latitude.toFixed(6)}:${longitude.toFixed(6)}`;
      if (seenCoordinates.has(key)) {
        continue;
      }

      seenCoordinates.add(key);
      points.push({
        id: `point-${points.length + 1}`,
        title: fallbackLabel ? `${fallbackLabel} ${points.length + 1}` : `Point ${points.length + 1}`,
        description: 'Imported from Google Maps link',
        latitude,
        longitude,
      });
    }
  }

  if (points.length === 0) {
    throw new GoogleMapsLinkError('No coordinates were found in the provided Google Maps link.');
  }

  return points;
}

export function importLocationsFromGoogleMapsLink(rawLink: string, fallbackLabel?: string): LocationPoint[] {
  return parseGoogleMapsLink(rawLink, fallbackLabel);
}