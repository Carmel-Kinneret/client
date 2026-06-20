import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClarifiedAir } from '../constants/theme';
// import MapboxGL from '@maplibre/maplibre-react-native';

export function TrailMap() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>MapLibre Integration Pending...</Text>
      {/* 
        <MapboxGL.MapView style={StyleSheet.absoluteFillObject}>
          <MapboxGL.Camera zoomLevel={14} centerCoordinate={[35.0, 32.7]} />
        </MapboxGL.MapView> 
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ClarifiedAir.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: ClarifiedAir.colors.textSecondary,
    fontWeight: 'bold',
  }
});
