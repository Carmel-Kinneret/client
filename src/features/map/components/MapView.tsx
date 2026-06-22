import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapViewComponent, { Marker } from 'react-native-maps';
import { LocationPoint } from '@/features/locations/types';
import { useMapCamera } from '../hooks/useMapCamera';
import { useMapStore } from '../stores/useMapStore';
import { MapControls } from './MapControls';

interface MapViewProps {
  locations: LocationPoint[];
}

export default function MapView({ locations }: MapViewProps) {
  const { mapRef, flyTo, resetBearing } = useMapCamera();
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);
  const selectedLocation = useMapStore((s) => s.selectedLocation);
  const userLocation = useMapStore((s) => s.userLocation);
  const userHeading = useMapStore((s) => s.userHeading);

  const handleMarkerPress = (loc: LocationPoint) => {
    setSelectedLocation(loc);
    flyTo([loc.longitude, loc.latitude], 15);
  };

  const handleLocateUser = () => {
    if (userLocation) {
      flyTo([userLocation.longitude, userLocation.latitude], 16);
    } else {
      console.warn('User location not available');
    }
  };

  useEffect(() => {
    if (selectedLocation) {
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
      >
        {/* User Location Marker with Heading Cone */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            flat={true}
          >
            <View style={styles.userMarkerContainer}>
              {/* Heading Cone rotates with userHeading */}
              {userHeading !== null && (
                <View
                  style={[
                    styles.headingCone,
                    { transform: [{ rotate: `${userHeading}deg` }] }
                  ]}
                />
              )}
              {/* Pulsing indicator core */}
              <View style={styles.userPulse} />
              <View style={styles.userDot} />
            </View>
          </Marker>
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
        onResetBearing={resetBearing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  map: { flex: 1 },
  userMarkerContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingCone: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 25,
    borderLeftColor: 'transparent',
    borderRightWidth: 25,
    borderRightColor: 'transparent',
    borderTopWidth: 60,
    borderTopColor: 'rgba(59, 130, 246, 0.35)',
    top: 40 - 60, // Align point of triangle to center (y = 40)
    left: 40 - 25, // Align point of triangle to center (x = 40)
  },
  userPulse: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
  },
  userDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
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
