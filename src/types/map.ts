export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type MapThemeMode = 'light' | 'dark';

export type CameraState = {
  centerCoordinate: [number, number];
  zoomLevel: number;
  pitch?: number;
  heading?: number;
  animationMode?: 'flyTo' | 'easeTo' | 'linearTo' | 'moveTo';
  animationDuration?: number;
};

export type GeoJsonPointProperties = {
  id: string;
  title: string;
  category?: string;
  selected?: boolean;
};

export type GeoJsonLineProperties = {
  distanceMeters: number;
  durationSeconds: number;
};

export type MapViewState = {
  isReady: boolean;
  isOffline: boolean;
  styleLoaded: boolean;
  camera: CameraState;
};