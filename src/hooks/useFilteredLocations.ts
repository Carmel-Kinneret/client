import { useMemo } from 'react';
import type { LocationPoint } from '@/src/types/location';
import { useMapStore } from '@/src/store/mapStore';
import { haversineDistanceMeters } from '@/src/utils/geo';

export function useFilteredLocations(locations: LocationPoint[]) {
  const searchQuery = useMapStore((state) => state.searchQuery);
  const selectedCategories = useMapStore((state) => state.selectedCategories);
  const userLocation = useMapStore((state) => state.userLocation);

  return useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredLocations = locations
      .filter((location) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          location.title.toLowerCase().includes(normalizedQuery) ||
          location.category?.toLowerCase().includes(normalizedQuery) ||
          location.description?.toLowerCase().includes(normalizedQuery);

        const matchesCategory =
          selectedCategories.length === 0 ||
          (location.category ? selectedCategories.includes(location.category) : false);

        return matchesQuery && matchesCategory;
      })
      .map((location) => ({
        ...location,
        distanceMeters: userLocation
          ? haversineDistanceMeters(userLocation, { latitude: location.latitude, longitude: location.longitude })
          : undefined,
      }))
      .sort((left, right) => {
        const leftDistance = left.distanceMeters ?? Number.POSITIVE_INFINITY;
        const rightDistance = right.distanceMeters ?? Number.POSITIVE_INFINITY;

        if (leftDistance !== rightDistance) {
          return leftDistance - rightDistance;
        }

        return left.title.localeCompare(right.title);
      });

    const categories = Array.from(
      new Set(locations.map((location) => location.category).filter((value): value is string => typeof value === 'string'))
    ).sort();

    return {
      filteredLocations,
      categories,
      totalCount: filteredLocations.length,
    };
  }, [locations, searchQuery, selectedCategories, userLocation]);
}