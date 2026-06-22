import { useState, useMemo } from 'react';
import { LocationPoint, Category } from '@/features/locations/types';

export function useSearchLocations(locations: LocationPoint[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchesSearch = loc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (loc.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? loc.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [locations, searchQuery, selectedCategory]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredLocations,
  };
}
