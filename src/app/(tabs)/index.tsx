import React, { useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import MapView from '@/features/map/components/MapView';
import { MapControls } from '@/features/map/components/MapControls';
import { SearchBar } from '@/features/search/components/SearchBar';
import { CategoryFilter } from '@/features/locations/components/CategoryFilter';
import { LocationDetails } from '@/features/locations/components/LocationDetails';
import { useSearchLocations } from '@/features/search/hooks/useSearchLocations';
import { useMapStore } from '@/features/map/stores/useMapStore';
import { LocationPoint } from '@/features/locations/types';

// Mock locations dataset
const MOCK_LOCATIONS: LocationPoint[] = [
  {
    id: '1',
    title: 'Cafe Central',
    category: 'Cafes',
    latitude: 32.0853,
    longitude: 34.7818,
    description: 'A cozy place to drink coffee and read a book with a vibrant atmosphere.',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    title: 'City Park',
    category: 'Attractions',
    latitude: 32.0910,
    longitude: 34.7860,
    description: 'Beautiful city park with large lakes, running trails, and picnic areas.',
    imageUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    title: 'Downtown Parking',
    category: 'Parking',
    latitude: 32.0820,
    longitude: 34.7800,
    description: 'Secure, 24/7 underground parking lot in the city center.',
  },
  {
    id: '4',
    title: 'Gourmet Burger Kitchen',
    category: 'Restaurants',
    latitude: 32.0870,
    longitude: 34.7840,
    description: 'Award-winning handcrafted burgers and artisanal fries.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  }
];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredLocations,
  } = useSearchLocations(MOCK_LOCATIONS);

  const selectedLocation = useMapStore(s => s.selectedLocation);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Define interactive bottom sheet snap points
  const snapPoints = useMemo(() => ['25%', '50%', '85%'], []);

  // Sync sheet visibility with marker selection
  React.useEffect(() => {
    if (selectedLocation) {
      bottomSheetRef.current?.snapToIndex(1); // snap to 50%
    } else {
      bottomSheetRef.current?.close();
    }
  }, [selectedLocation]);

  return (
    <View style={styles.container}>
      <MapView locations={filteredLocations} />
      
      {/* Floating Header UI */}
      <View 
        style={{ paddingTop: Math.max(insets.top, 16) }} 
        className="absolute top-0 left-0 right-0 z-10 px-4"
      >
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <View className="mt-3 -mx-4">
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </View>
      </View>

      {/* Map Controls overlaid */}
      <MapControls 
        onLocateUser={() => { /* trigger locate user */ }} 
        onResetBearing={() => { /* trigger reset bearing */ }} 
      />

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => useMapStore.getState().setSelectedLocation(null)}
        backgroundStyle={{ backgroundColor: '#ffffff', borderRadius: 24 }}
        handleIndicatorStyle={{ backgroundColor: '#d1d5db', width: 40, height: 5 }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <LocationDetails location={selectedLocation} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
});
