/**
 * Parses various formats of Google Maps links to extract coordinates.
 * Supports:
 * - @lat,lng format
 * - q=lat,lng format
 * - ll=lat,lng format
 */
export function parseGoogleMapsLink(url: string): { latitude: number; longitude: number } | null {
  try {
    const uri = new URL(url);
    
    // Check for @lat,lng,zoom format in pathname (e.g. /maps/place/.../@32.0853,34.7818,15z)
    const atMatch = uri.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      return { latitude: parseFloat(atMatch[1]), longitude: parseFloat(atMatch[2]) };
    }

    // Check query params (e.g. ?q=lat,lng or ?ll=lat,lng)
    const qParam = uri.searchParams.get('q') || uri.searchParams.get('ll') || uri.searchParams.get('query');
    if (qParam) {
      const parts = qParam.split(',');
      if (parts.length >= 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { latitude: lat, longitude: lng };
        }
      }
    }

    return null;
  } catch (e) {
    return null;
  }
}
