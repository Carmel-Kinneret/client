import { TurboModuleRegistry } from 'react-native';
import type * as MapLibreGLNamespace from '@maplibre/maplibre-react-native';

let MapLibreGL: typeof MapLibreGLNamespace | null = null;
let isMapLibreSupported = false;

try {
  const hasNativeModule = TurboModuleRegistry.get('MLRNCameraModule') !== null;
  if (hasNativeModule) {
    MapLibreGL = require('@maplibre/maplibre-react-native').default;
    isMapLibreSupported = true;
  }
} catch (e) {
  console.warn('Failed to load @maplibre/maplibre-react-native:', e);
}

export { MapLibreGL, isMapLibreSupported };
