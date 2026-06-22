import { parseGoogleMapsLink } from '../googleMapsParser';

describe('googleMapsParser', () => {
  it('should parse @lat,lng format from the URL path', () => {
    const url = 'https://www.google.com/maps/place/Some+Place/@32.0853,34.7818,15z/data=...';
    const result = parseGoogleMapsLink(url);
    expect(result).toEqual({ latitude: 32.0853, longitude: 34.7818 });
  });

  it('should parse q=lat,lng format from query parameters', () => {
    const url = 'https://maps.google.com/?q=32.0853,34.7818';
    const result = parseGoogleMapsLink(url);
    expect(result).toEqual({ latitude: 32.0853, longitude: 34.7818 });
  });

  it('should parse ll=lat,lng format from query parameters', () => {
    const url = 'https://maps.google.com/?ll=32.0853,34.7818&z=15';
    const result = parseGoogleMapsLink(url);
    expect(result).toEqual({ latitude: 32.0853, longitude: 34.7818 });
  });

  it('should handle invalid or unparseable URLs gracefully', () => {
    const url = 'https://www.google.com/maps/search/restaurants';
    const result = parseGoogleMapsLink(url);
    expect(result).toBeNull();
  });

  it('should handle completely malformed URLs', () => {
    const result = parseGoogleMapsLink('not-a-url');
    expect(result).toBeNull();
  });
});
