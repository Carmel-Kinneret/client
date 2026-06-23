import { create } from 'zustand';
import { LocationPoint } from '@/features/locations/types';

interface MapState {
  selectedLocation: LocationPoint | null;
  setSelectedLocation: (location: LocationPoint | null) => void;
  userLocation: { latitude: number; longitude: number } | null;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  userHeading: number | null;
  setUserHeading: (heading: number | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),
  userHeading: null,
  setUserHeading: (heading) => set({ userHeading: heading }),
}));
