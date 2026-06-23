import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import MapViewComponent, { Marker, Polyline } from 'react-native-maps';
import Svg, { Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { LocationPoint } from '@/features/locations/types';
import { useMapCamera } from '../hooks/useMapCamera';
import { useMapStore } from '../stores/useMapStore';
import { MapControls } from './MapControls';
import trailData from '@/constants/carmel_kinneret_clean.json';

interface MapViewProps {
  locations: LocationPoint[];
}

export default function MapView({ locations }: MapViewProps) {
  const { mapRef, flyTo, resetBearing } = useMapCamera();
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);
  const selectedLocation = useMapStore((s) => s.selectedLocation);
  const userLocation = useMapStore((s) => s.userLocation);
  const userHeading = useMapStore((s) => s.userHeading);

  // Parse trail coordinates from carmel_kinneret_clean GeoJSON data
  const trailCoords = useMemo(() => {
    if (!trailData || !trailData.geometry || !trailData.geometry.coordinates) return [];
    return trailData.geometry.coordinates.map((coord: any) => ({
      latitude: coord[1],
      longitude: coord[0],
    }));
  }, []);

  const [mapBearing, setMapBearing] = React.useState(0);
  const [isFollowingUser, setIsFollowingUser] = React.useState(false);
  const [hasInitialFocus, setHasInitialFocus] = React.useState(false);

  // Sync camera when user location changes and follow mode is active
  useEffect(() => {
    if (isFollowingUser && userLocation) {
      flyTo([userLocation.longitude, userLocation.latitude], 16);
    }
  }, [userLocation, isFollowingUser]);

  // Initial focus on user when location is first fetched
  useEffect(() => {
    if (userLocation && !hasInitialFocus) {
      setHasInitialFocus(true);
      setIsFollowingUser(true);
      flyTo([userLocation.longitude, userLocation.latitude], 16);
    }
  }, [userLocation, hasInitialFocus]);

  const handleMarkerPress = (loc: LocationPoint) => {
    setIsFollowingUser(false); // disable following when selecting a marker
    setSelectedLocation(loc);
    flyTo([loc.longitude, loc.latitude], 15);
  };

  const handleLocateUser = () => {
    if (userLocation) {
      setIsFollowingUser(true);
      flyTo([userLocation.longitude, userLocation.latitude], 16);
    } else {
      console.warn('User location not available');
    }
  };

  const handleResetBearing = () => {
    resetBearing();
    setMapBearing(0);
  };

  useEffect(() => {
    if (selectedLocation) {
      setIsFollowingUser(false);
      flyTo([selectedLocation.longitude, selectedLocation.latitude], 15);
    }
  }, [selectedLocation]);

  return (
    <View style={styles.container}>
      <MapViewComponent
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 32.73,
          longitude: 35.25,
          latitudeDelta: 0.35,
          longitudeDelta: 0.35,
        }}
        showsUserLocation={false}
        showsCompass={false}
        showsMyLocationButton={false}
        showsScale={true}
        onPanDrag={() => {
          setIsFollowingUser(false);
        }}
        onRegionChangeComplete={async (region, details) => {
          if (details?.isGesture) {
            setIsFollowingUser(false);
          }
          if (mapRef.current) {
            try {
              const camera = await mapRef.current.getCamera();
              setMapBearing(camera.heading || 0);
            } catch (e) {
              // Ignore errors during transition
            }
          }
        }}
      >
        {/* User Location Marker with Heading Cone */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            flat={false}
            tracksViewChanges={true}
          >
            <View 
              style={[
                styles.userMarkerContainer,
                { paddingTop: userHeading !== null ? (Math.round(userHeading) % 2 === 0 ? 0.1 : 0) : 0 }
              ]}
            >
              {/* Heading Cone rotates with userHeading adjusted for mapBearing */}
              {userHeading !== null && (
                <View
                  style={[
                    styles.headingConeContainer,
                    { transform: [{ rotate: `${userHeading - mapBearing}deg` }] }
                  ]}
                >
                  <Svg width={180} height={180} style={styles.headingConeSvg}>
                    <Defs>
                      <RadialGradient
                        id="coneGrad"
                        cx="90"
                        cy="90"
                        rx="90"
                        ry="90"
                        fx="90"
                        fy="90"
                        gradientUnits="userSpaceOnUse"
                      >
                        <Stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                        <Stop offset="25%" stopColor="#3b82f6" stopOpacity={0.35} />
                        <Stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </RadialGradient>
                    </Defs>
                    <Path d="M 90 90 L 45 12 A 90 90 0 0 1 135 12 Z" fill="url(#coneGrad)" />
                  </Svg>
                </View>
              )}
              {/* Pulsing indicator core */}
              <View style={styles.userPulse} />
              <View style={styles.userDot} />
            </View>
          </Marker>
        )}

        {/* Green Trail Line from carmel_kinneret_clean */}
        {trailCoords.length > 0 && (
          <Polyline
            coordinates={trailCoords}
            strokeColor="#10b981"
            strokeWidth={4}
          />
        )}

        {/* Location Markers */}
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            title={loc.title}
            description={loc.description}
            onPress={() => handleMarkerPress(loc)}
            pinColor={selectedLocation?.id === loc.id ? '#3b82f6' : '#ef4444'}
          />
        ))}
      </MapViewComponent>

      {/* Floating Map Controls */}
      <MapControls
        onLocateUser={handleLocateUser}
        onResetBearing={handleResetBearing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  map: { flex: 1 },
  userMarkerContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingConeContainer: {
    position: 'absolute',
    top: 60,
    left: 60,
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingConeSvg: {
    position: 'absolute',
    top: -90,
    left: -90,
    width: 180,
    height: 180,
  },
  userPulse: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
  },
  userDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    borderWidth: 2,
    borderColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
