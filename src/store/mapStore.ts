import { create } from 'zustand';
import type { LocationPoint } from '@/src/types/location';
import type { MapCoordinate } from '@/src/types/map';
import type { NavigationMode, NavigationRoute, NavigationTarget } from '@/src/types/navigation';

type MapStoreState = {
  locations: LocationPoint[];
  selectedLocationId: string | null;
  searchQuery: string;
  selectedCategories: string[];
  isSheetOpen: boolean;
  followUser: boolean;
  userLocation: MapCoordinate | null;
  userHeading: number | null;
  isOffline: boolean;
  isMapReady: boolean;
  mapStyleLoaded: boolean;
  permissionDenied: boolean;
  navigationMode: NavigationMode;
  navigationTarget: NavigationTarget | null;
  navigationRoute: NavigationRoute | null;
  setLocations: (locations: LocationPoint[]) => void;
  setSearchQuery: (searchQuery: string) => void;
  toggleCategory: (category: string) => void;
  clearCategoryFilters: () => void;
  openLocationSheet: (locationId: string) => void;
  closeLocationSheet: () => void;
  setFollowUser: (followUser: boolean) => void;
  setUserLocation: (location: MapCoordinate | null, heading?: number | null) => void;
  setOffline: (isOffline: boolean) => void;
  setMapReady: (isMapReady: boolean) => void;
  setMapStyleLoaded: (mapStyleLoaded: boolean) => void;
  setPermissionDenied: (permissionDenied: boolean) => void;
  setNavigationMode: (navigationMode: NavigationMode) => void;
  setNavigationTarget: (target: NavigationTarget | null) => void;
  setNavigationRoute: (route: NavigationRoute | null) => void;
  resetNavigation: () => void;
};

const initialState = {
  selectedLocationId: null,
  searchQuery: '',
  selectedCategories: [] as string[],
  isSheetOpen: false,
  followUser: false,
  userLocation: null,
  userHeading: null,
  isOffline: false,
  isMapReady: false,
  mapStyleLoaded: false,
  permissionDenied: false,
  navigationMode: 'idle' as NavigationMode,
  navigationTarget: null,
  navigationRoute: null,
};

export const useMapStore = create<MapStoreState>((set) => ({
  locations: [],
  ...initialState,
  setLocations: (locations) => set({ locations }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  toggleCategory: (category) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((value) => value !== category)
        : [...state.selectedCategories, category],
    })),
  clearCategoryFilters: () => set({ selectedCategories: [] }),
  openLocationSheet: (locationId) => set({ selectedLocationId: locationId, isSheetOpen: true }),
  closeLocationSheet: () => set({ isSheetOpen: false }),
  setFollowUser: (followUser) => set({ followUser }),
  setUserLocation: (location, heading) => set({ userLocation: location, userHeading: heading ?? null }),
  setOffline: (isOffline) => set({ isOffline }),
  setMapReady: (isMapReady) => set({ isMapReady }),
  setMapStyleLoaded: (mapStyleLoaded) => set({ mapStyleLoaded }),
  setPermissionDenied: (permissionDenied) => set({ permissionDenied }),
  setNavigationMode: (navigationMode) => set({ navigationMode }),
  setNavigationTarget: (navigationTarget) => set({ navigationTarget }),
  setNavigationRoute: (navigationRoute) => set({ navigationRoute }),
  resetNavigation: () => set({ navigationMode: 'idle', navigationTarget: null, navigationRoute: null }),
}));

export function selectLocationById(state: MapStoreState, locationId: string | null): LocationPoint | undefined {
  return state.locations.find((location) => location.id === locationId);
}

export function useSelectedLocation() {
  return useMapStore((state) => selectLocationById(state, state.selectedLocationId));
}

export function useMapUiState() {
  return useMapStore((state) => ({
    searchQuery: state.searchQuery,
    selectedCategories: state.selectedCategories,
    followUser: state.followUser,
    isOffline: state.isOffline,
    isMapReady: state.isMapReady,
    mapStyleLoaded: state.mapStyleLoaded,
    permissionDenied: state.permissionDenied,
    navigationMode: state.navigationMode,
    navigationTarget: state.navigationTarget,
    navigationRoute: state.navigationRoute,
  }));
}