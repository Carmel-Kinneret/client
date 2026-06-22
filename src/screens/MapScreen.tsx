import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/nativewindui/Button';
import { Text } from '@/components/nativewindui/Text';
import { FilterChips } from '@/src/components/ui/FilterChips';
import { SearchBar } from '@/src/components/ui/SearchBar';
import { LocationCard } from '@/src/components/cards/LocationCard';
import { BottomSheetContent } from '@/src/components/sheets/BottomSheetContent';
import { FloatingActionButtons } from '@/src/components/map/FloatingActionButtons';
import { UserLocationButton } from '@/src/components/map/UserLocationButton';
import { MapLibreMap } from '@/src/components/map/MapLibreMap';
import { SAMPLE_GOOGLE_MAPS_LINK, SAMPLE_LOCATIONS } from '@/src/constants/mockLocations';
import { importLocationsFromGoogleMapsLink, GoogleMapsLinkError } from '@/src/services/googleMapsParser';
import { fetchNavigationRoute } from '@/src/services/navigationService';
import { useCurrentLocation } from '@/src/hooks/useCurrentLocation';
import { useFilteredLocations } from '@/src/hooks/useFilteredLocations';
import { useMapStore, useSelectedLocation } from '@/src/store/mapStore';
import type { LocationPoint } from '@/src/types/location';
import type { MapCoordinate } from '@/src/types/map';
import { formatDistanceMeters, haversineDistanceMeters } from '@/src/utils/geo';
import { useColorScheme } from '@/lib/useColorScheme';

const GOOGLE_LINK_QUERY_KEY = ['locations', 'google-maps-link'];

export function MapScreen() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { errorMessage } = useCurrentLocation();
  const { colorScheme, colors } = useColorScheme();
  const [cameraZoom, setCameraZoom] = useState(12);
  const [cameraTarget, setCameraTarget] = useState<MapCoordinate | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [routeSummary, setRouteSummary] = useState<string | null>(null);

  const locations = useMapStore((state) => state.locations);
  const searchQuery = useMapStore((state) => state.searchQuery);
  const setLocations = useMapStore((state) => state.setLocations);
  const setSearchQuery = useMapStore((state) => state.setSearchQuery);
  const toggleCategory = useMapStore((state) => state.toggleCategory);
  const clearCategoryFilters = useMapStore((state) => state.clearCategoryFilters);
  const openLocationSheet = useMapStore((state) => state.openLocationSheet);
  const closeLocationSheet = useMapStore((state) => state.closeLocationSheet);
  const isSheetOpen = useMapStore((state) => state.isSheetOpen);
  const followUser = useMapStore((state) => state.followUser);
  const setFollowUser = useMapStore((state) => state.setFollowUser);
  const userLocation = useMapStore((state) => state.userLocation);
  const selectedCategories = useMapStore((state) => state.selectedCategories);
  const isOffline = useMapStore((state) => state.isOffline);
  const setOffline = useMapStore((state) => state.setOffline);
  const navigationRoute = useMapStore((state) => state.navigationRoute);
  const setNavigationRoute = useMapStore((state) => state.setNavigationRoute);
  const setNavigationMode = useMapStore((state) => state.setNavigationMode);
  const setNavigationTarget = useMapStore((state) => state.setNavigationTarget);
  const resetNavigation = useMapStore((state) => state.resetNavigation);
  const selectedLocation = useSelectedLocation() ?? null;

  const importedLocationsQuery = useQuery({
    queryKey: GOOGLE_LINK_QUERY_KEY,
    queryFn: async () => importLocationsFromGoogleMapsLink(SAMPLE_GOOGLE_MAPS_LINK, 'Imported point'),
    initialData: SAMPLE_LOCATIONS,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (importedLocationsQuery.data?.length) {
      setLocations(importedLocationsQuery.data);
    }
  }, [importedLocationsQuery.data, setLocations]);

  useEffect(() => {
    if (importedLocationsQuery.isError) {
      const message = importedLocationsQuery.error instanceof GoogleMapsLinkError
        ? importedLocationsQuery.error.message
        : 'The Google Maps link could not be imported.';
      setLocalError(message);
      setLocations(SAMPLE_LOCATIONS);
    }
  }, [importedLocationsQuery.error, importedLocationsQuery.isError, setLocations]);

  useEffect(() => {
    const updateConnectivity = () => setOffline(typeof navigator !== 'undefined' ? !navigator.onLine : false);
    updateConnectivity();

    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('online', updateConnectivity);
    window.addEventListener('offline', updateConnectivity);
    return () => {
      window.removeEventListener('online', updateConnectivity);
      window.removeEventListener('offline', updateConnectivity);
    };
  }, [setOffline]);

  useEffect(() => {
    const originLocation = userLocation;
    const targetLocation = selectedLocation;

    if (!targetLocation || !originLocation) {
      setNavigationRoute(null);
      setRouteSummary(null);
      return;
    }

    let canceled = false;
    const resolvedOriginLocation = originLocation as MapCoordinate;
    const resolvedTargetLocation = targetLocation as LocationPoint;

    async function loadRoute() {
      const route = await fetchNavigationRoute(resolvedOriginLocation, {
        latitude: resolvedTargetLocation.latitude,
        longitude: resolvedTargetLocation.longitude,
      });

      if (canceled) {
        return;
      }

      setNavigationRoute(route);
      setRouteSummary(`${formatDistanceMeters(route.distanceMeters)} • ${Math.max(Math.round(route.durationSeconds / 60), 1)} min`);
    }

    void loadRoute();

    return () => {
      canceled = true;
    };
  }, [selectedLocation, setNavigationRoute, userLocation]);

  useEffect(() => {
    if (!isSheetOpen) {
      bottomSheetRef.current?.dismiss();
      return;
    }

    bottomSheetRef.current?.present();
  }, [isSheetOpen]);

  function handleSelectLocation(location: LocationPoint) {
    openLocationSheet(location.id);
    setCameraTarget({ latitude: location.latitude, longitude: location.longitude });
    setCameraZoom(15.5);
    setSearchFocused(false);
  }

  function handleClusterPress(longitude: number, latitude: number, pointCount: number) {
    setCameraTarget({ latitude, longitude });
    setCameraZoom((zoom) => Math.min(zoom + 1.5, 18));
    setLocalError(`Zoomed into a cluster containing ${pointCount} locations.`);
  }

  function handleMapTap() {
    setSearchFocused(false);
  }

  async function handleNavigate() {
    if (!selectedLocation) {
      return;
    }

    setNavigationMode('active');
    setNavigationTarget({
      id: selectedLocation.id,
      title: selectedLocation.title,
      coordinate: { latitude: selectedLocation.latitude, longitude: selectedLocation.longitude },
    });
    bottomSheetRef.current?.dismiss();
  }

  function handleCenterOnSelected() {
    if (!selectedLocation) {
      return;
    }

    setCameraTarget({ latitude: selectedLocation.latitude, longitude: selectedLocation.longitude });
    setCameraZoom(16);
  }

  function handleSheetClose() {
    closeLocationSheet();
    bottomSheetRef.current?.dismiss();
  }

  function handleStopNavigation() {
    resetNavigation();
    setNavigationRoute(null);
  }

  const { filteredLocations, categories, totalCount } = useFilteredLocations(locations);

  const sheetDistance = useMemo(() => {
    if (!selectedLocation || !userLocation) {
      return undefined;
    }

    return haversineDistanceMeters(userLocation, {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    });
  }, [selectedLocation, userLocation]);

  const isDarkMode = colorScheme === 'dark';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="absolute left-0 right-0 top-0 z-30 gap-3 px-4 pt-3">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={() => setSearchFocused(false)}
          onClear={() => setSearchQuery('')}
          onFocus={() => setSearchFocused(true)}
        />
        <FilterChips
          categories={categories}
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          onClearFilters={clearCategoryFilters}
        />
      </View>

      <MapLibreMap
        locations={filteredLocations}
        selectedLocation={selectedLocation}
        route={navigationRoute}
        userLocation={userLocation}
        followUser={followUser}
        cameraZoom={cameraZoom}
        cameraTarget={cameraTarget}
        isDarkMode={isDarkMode}
        onPointPress={handleSelectLocation}
        onClusterPress={handleClusterPress}
        onMapReady={() => void 0}
        onStyleLoaded={() => void 0}
        onMapTap={handleMapTap}
      />

      <View className="absolute left-4 right-4 top-[130px] z-20 gap-2">
        {localError ? <Notice tone="warning" message={localError} onDismiss={() => setLocalError(null)} /> : null}
        {errorMessage ? <Notice tone="danger" message={errorMessage} onDismiss={() => void 0} /> : null}
        {isOffline ? <Notice tone="warning" message="Offline mode is active. Cached map tiles and local actions remain available." onDismiss={() => void 0} /> : null}
        {!importedLocationsQuery.data?.length ? <Notice tone="neutral" message="No coordinates imported yet. Showing sample locations." onDismiss={() => void 0} /> : null}
      </View>

      {searchFocused || searchQuery.length > 0 ? (
        <View className="absolute left-4 right-4 top-[220px] z-20 max-h-[42%] rounded-3xl border border-border bg-card/95 p-3">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              {totalCount} result{totalCount === 1 ? '' : 's'}
            </Text>
            <Button variant="plain" onPress={() => setSearchFocused(false)}>
              <Text className="text-[13px] font-semibold text-foreground">Close results</Text>
            </Button>
          </View>
          <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item.id}
            initialNumToRender={6}
            windowSize={5}
            renderItem={({ item }) => <LocationCard location={item} selected={item.id === selectedLocation?.id} onPress={handleSelectLocation} />}
            ItemSeparatorComponent={() => <View className="h-2" />}
            ListEmptyComponent={<EmptyState onClearFilters={clearCategoryFilters} />}
            contentContainerStyle={{ paddingBottom: 8 }}
          />
        </View>
      ) : null}

      <View className="absolute bottom-6 left-4 z-20 gap-3">
        <UserLocationButton onPress={() => setFollowUser(!followUser)} enabled={followUser} />
      </View>
      <FloatingActionButtons
        onZoomIn={() => setCameraZoom((value) => Math.min(value + 1, 19))}
        onZoomOut={() => setCameraZoom((value) => Math.max(value - 1, 1))}
        onToggleFollow={() => setFollowUser(!followUser)}
        isFollowing={followUser}
      />

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['45%', '75%']}
        enablePanDownToClose
        onDismiss={handleSheetClose}
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
      >
        {selectedLocation ? (
          <BottomSheetContent
            location={selectedLocation}
            distanceMeters={sheetDistance}
            userLocation={userLocation}
            routeSummary={routeSummary ?? undefined}
            onNavigate={handleNavigate}
            onCenterMap={handleCenterOnSelected}
            onClose={handleSheetClose}
          />
        ) : null}
      </BottomSheetModal>

      {navigationRoute ? (
        <View className="absolute left-4 right-4 bottom-24 z-20">
          <RouteBanner routeSummary={routeSummary ?? 'Route ready'} onStop={handleStopNavigation} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

type NoticeTone = 'neutral' | 'warning' | 'danger';

function Notice({ tone, message, onDismiss }: { tone: NoticeTone; message: string; onDismiss: () => void }) {
  const toneClasses = {
    neutral: 'border-border bg-card text-foreground',
    warning: 'border-amber-400/40 bg-amber-50 text-amber-950 dark:bg-amber-950/25 dark:text-amber-100',
    danger: 'border-red-400/40 bg-red-50 text-red-950 dark:bg-red-950/25 dark:text-red-100',
  }[tone];

  return (
    <View className={`rounded-3xl border px-4 py-3 ${toneClasses}`}>
      <Text className="text-[13px] leading-5">{message}</Text>
      <Button variant="plain" onPress={onDismiss}>
        <Text className="text-[13px] font-semibold text-foreground">Dismiss</Text>
      </Button>
    </View>
  );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <View className="items-center gap-3 rounded-3xl border border-dashed border-border bg-background/60 px-4 py-8">
      <Text className="text-[15px] font-semibold text-foreground">No locations match your filters.</Text>
      <Text className="text-center text-[13px] text-muted-foreground">Try a different search term or clear the category filters.</Text>
      <Button variant="secondary" onPress={onClearFilters}>
        <Text className="text-[15px] font-semibold text-foreground">Reset filters</Text>
      </Button>
    </View>
  );
}

function RouteBanner({ routeSummary, onStop }: { routeSummary: string; onStop: () => void }) {
  return (
    <View className="rounded-3xl border border-border bg-card px-4 py-3 shadow-lg shadow-black/10">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Text className="text-[13px] font-semibold uppercase tracking-wide text-primary">Navigation active</Text>
          <Text className="mt-1 text-[14px] text-foreground">{routeSummary}</Text>
        </View>
        <Button variant="secondary" onPress={onStop}>
          <Text className="text-[14px] font-semibold text-foreground">Stop</Text>
        </Button>
      </View>
    </View>
  );
}