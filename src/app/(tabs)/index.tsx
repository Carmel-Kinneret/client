import React, { useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import MapView from '@/features/map/components/MapView';
import { SearchBar } from '@/features/search/components/SearchBar';
import { LocationDetails } from '@/features/locations/components/LocationDetails';
import { useSearchLocations } from '@/features/search/hooks/useSearchLocations';
import { useMapStore } from '@/features/map/stores/useMapStore';
import { useUserLocation } from '@/features/map/hooks/useUserLocation';
import { LocationPoint } from '@/features/locations/types';

// Mock locations dataset
const MOCK_LOCATIONS: LocationPoint[] = [
  {
    id: '1',
    title: 'Dropped Pin - Ein Dor',
    category: 'Attractions',
    latitude: 32.6591115,
    longitude: 35.4372246,
    description: 'Dropped pin near archaeological ruins and the museum of Ein Dor.',
  },
  {
    id: '2',
    title: 'Hoshaya (הושעיה)',
    category: 'Attractions',
    latitude: 32.7554904,
    longitude: 35.2929119,
    description: 'A beautiful community settlement situated in the lower Galilee region.',
  },
  {
    id: '3',
    title: 'Matnas Har Yona',
    category: 'Attractions',
    latitude: 32.7247659,
    longitude: 35.3185387,
    description: 'Har Yona community center offering activities and cultural events.',
  },
  {
    id: '4',
    title: 'Resh Lakish Olive Press',
    category: 'Restaurants',
    latitude: 32.7497634,
    longitude: 35.2785301,
    description: 'Sustainable family olive press, showcasing eco-friendly oil production.',
  },
  {
    id: '5',
    title: 'Monasterio de la Sagrada Familia',
    category: 'Attractions',
    latitude: 32.7540443,
    longitude: 35.2771271,
    description: 'Historical Monastery of the Sacred Family in Nazareth region.',
  },
  {
    id: '6',
    title: 'Haunted House Garden',
    category: 'Attractions',
    latitude: 32.7754023,
    longitude: 35.1705867,
    description: 'Public garden located adjacent to the local Haunted House site.',
  },
  {
    id: '7',
    title: 'Galilean Madafeh',
    category: 'Restaurants',
    latitude: 32.7461479,
    longitude: 35.1825409,
    description: 'Authentic local cuisine featuring traditional Galilean dishes.',
  },
  {
    id: '8',
    title: 'Beit Ahva Nursing Home',
    category: 'Other',
    latitude: 32.7416316,
    longitude: 35.0771505,
    description: 'Local nursing home and community care center.',
  },
  {
    id: '9',
    title: 'Tzipor HaNefesh Gift Shop',
    category: 'Cafes',
    latitude: 32.7263269,
    longitude: 35.0564095,
    description: 'ציפור הנפש - Charming gift shop offering handcrafted goods and refreshments.',
  },
  {
    id: '10',
    title: 'Israel Trail Campground',
    category: 'Attractions',
    latitude: 32.7427688,
    longitude: 35.0588734,
    description: 'חניון שביל ישראל - Rest stop and campground along the National Israel Trail.',
  }
];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  
  // Start location and heading tracking hook
  useUserLocation();

  const {
    searchQuery,
    setSearchQuery,
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
      </View>

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
