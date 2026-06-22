import type { MapCoordinate } from './map';

export type NavigationMode = 'idle' | 'preview' | 'active';

export type NavigationTarget = {
  id: string;
  title: string;
  coordinate: MapCoordinate;
};

export type RouteInstruction = {
  id: string;
  title: string;
  distanceMeters: number;
  durationSeconds: number;
  coordinate: MapCoordinate;
};

export type NavigationRoute = {
  distanceMeters: number;
  durationSeconds: number;
  coordinates: Array<[number, number]>;
  instructions: RouteInstruction[];
};