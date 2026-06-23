import React, { useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LocationPoint } from '@/features/locations/types';
import { useMapStore } from '../stores/useMapStore';
import { MapControls } from './MapControls';
import trailData from '@/constants/carmel_kinneret_clean.json';

interface MapViewProps {
  locations: LocationPoint[];
}

export default function MapView({ locations }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const setSelectedLocation = useMapStore((s) => s.setSelectedLocation);
  const selectedLocation = useMapStore((s) => s.selectedLocation);
  const userLocation = useMapStore((s) => s.userLocation);
  const userHeading = useMapStore((s) => s.userHeading);

  const userMarkerRef = useRef<any>(null);
  const userConeRef = useRef<HTMLDivElement | null>(null);

  console.log('MapView.web.tsx: Rendering component. Locations count:', locations.length);

  // Convert locations to GeoJSON FeatureCollection
  const geojsonData = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: locations.map((loc) => ({
        type: 'Feature' as const,
        id: loc.id,
        geometry: {
          type: 'Point' as const,
          coordinates: [loc.longitude, loc.latitude] as [number, number],
        },
        properties: {
          id: loc.id,
          category: loc.category,
        },
      })),
    }),
    [locations]
  );

  const trailGeojsonData = useMemo(() => trailData, []);

  // Initialize Map
  useEffect(() => {
    console.log('MapView.web.tsx: useEffect triggered. window defined:', typeof window !== 'undefined', 'containerRef:', mapContainerRef.current);
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let maplibregl: any;
    try {
      const mod = require('maplibre-gl/dist/maplibre-gl.js');
      maplibregl = mod.default || mod;
    } catch (e) {
      console.error('Failed to dynamically require maplibre-gl:', e);
      return;
    }

    // Inject maplibre-gl CSS if not already present
    const cssId = 'maplibre-gl-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/maplibre-gl@4.7.0/dist/maplibre-gl.css';
      document.head.appendChild(link);
    }

    let map: any;
    try {
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors',
            },
          },
          layers: [
            {
              id: 'osm-tiles-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [35.25, 32.73],
        zoom: 10,
      });
    } catch (err) {
      console.error('Failed to instantiate maplibregl.Map:', err);
      return;
    }

    mapRef.current = map;

    map.on('load', () => {
      // Add source and layer for the green trail line
      map.addSource('trail-line', {
        type: 'geojson',
        data: trailGeojsonData,
      });

      map.addLayer({
        id: 'trail-line-layer',
        type: 'line',
        source: 'trail-line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#10b981',
          'line-width': 4,
          'line-opacity': 0.85,
        },
      });

      // Add source for locations
      map.addSource('locations', {
        type: 'geojson',
        data: geojsonData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Add cluster circles layer
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'locations',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#3b82f6',
          'circle-radius': ['step', ['get', 'point_count'], 15, 10, 20, 50, 25],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Add cluster counts layer
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'locations',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#ffffff',
        },
      });

      // Add unclustered points layer
      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'locations',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#ef4444',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Handle click on clusters
      map.on('click', 'clusters', (e: any) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        });
        const clusterId = features[0]?.properties?.cluster_id;
        const source = map.getSource('locations');
        if (source && (source as any).getClusterExpansionZoom) {
          (source as any).getClusterExpansionZoom(clusterId).then((zoom: number) => {
            const coords = (features[0].geometry as any).coordinates;
            map.easeTo({
              center: coords,
              zoom: zoom,
            });
          });
        }
      });

      // Handle click on individual points
      map.on('click', 'unclustered-point', (e: any) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['unclustered-point'],
        });
        const properties = features[0]?.properties;
        if (properties) {
          const locationId = properties.id;
          const loc = locations.find((l) => l.id === locationId);
          if (loc) {
            setSelectedLocation(loc);
            map.easeTo({
              center: [loc.longitude, loc.latitude],
              zoom: 15,
            });
          }
        }
      });

      // Handle click on map background (deselect)
      map.on('click', (e: any) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters', 'unclustered-point'],
        });
        if (!features.length) {
          setSelectedLocation(null);
        }
      });

      // Change cursor on hover
      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
      });
      map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
        userConeRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update source data when locations change
  useEffect(() => {
    const map = mapRef.current;
    if (map && map.isStyleLoaded && map.isStyleLoaded()) {
      const source = map.getSource('locations');
      if (source) {
        source.setData(geojsonData);
      }
      const lineSource = map.getSource('trail-line');
      if (lineSource) {
        lineSource.setData(trailGeojsonData);
      }
    }
  }, [geojsonData, trailGeojsonData]);

  // Sync camera when selectedLocation changes externally
  useEffect(() => {
    const map = mapRef.current;
    if (map && selectedLocation) {
      map.easeTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 15,
      });
    }
  }, [selectedLocation]);

  // Sync User Location Marker on Web Map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
        userConeRef.current = null;
      }
      return;
    }

    if (!userMarkerRef.current) {
      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.width = '120px';
      container.style.height = '120px';
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';

      // Heading cone element (SVG-based rounded wedge with radial gradient)
      const cone = document.createElement('div');
      cone.style.position = 'absolute';
      cone.style.width = '180px';
      cone.style.height = '180px';
      cone.style.top = '-30px'; // center 180px inside 120px container
      cone.style.left = '-30px'; // center 180px inside 120px container
      cone.style.transformOrigin = 'center';
      cone.style.transition = 'transform 0.2s ease-out';
      
      cone.innerHTML = `
        <svg width="180" height="180" viewBox="0 0 180 180" style="display: block;">
          <defs>
            <radialGradient id="webConeGrad" cx="90" cy="90" r="90" fx="90" fy="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5" />
              <stop offset="25%" stop-color="#3b82f6" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
            </radialGradient>
          </defs>
          <path d="M 90 90 L 45 12 A 90 90 0 0 1 135 12 Z" fill="url(#webConeGrad)" />
        </svg>
      `;
      
      if (userHeading !== null) {
        cone.style.transform = `rotate(${userHeading}deg)`;
      } else {
        cone.style.display = 'none';
      }
      container.appendChild(cone);
      userConeRef.current = cone;

      // Pulse ring
      const pulse = document.createElement('div');
      pulse.style.position = 'absolute';
      pulse.style.width = '36px';
      pulse.style.height = '36px';
      pulse.style.top = '42px'; // center at 60px
      pulse.style.left = '42px'; // center at 60px
      pulse.style.borderRadius = '50%';
      pulse.style.backgroundColor = 'rgba(59, 130, 246, 0.25)';
      pulse.className = 'user-pulse-animation';
      container.appendChild(pulse);

      // Core dot
      const dot = document.createElement('div');
      dot.style.position = 'absolute';
      dot.style.width = '20px';
      dot.style.height = '20px';
      dot.style.top = '50px'; // center at 60px
      dot.style.left = '50px'; // center at 60px
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = '#3b82f6';
      dot.style.border = '2px solid #ffffff';
      dot.style.boxShadow = '0 2px 4px rgba(0,0,0,0.25)';
      
      container.appendChild(dot);

      // Add CSS styles for pulsing animation
      const styleId = 'user-marker-keyframes';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          @keyframes userPulse {
            0% { transform: scale(0.9); opacity: 0.8; }
            70% { transform: scale(2.2); opacity: 0; }
            100% { transform: scale(2.2); opacity: 0; }
          }
          .user-pulse-animation {
            animation: userPulse 2s infinite ease-out;
          }
        `;
        document.head.appendChild(style);
      }

      let maplibregl: any;
      try {
        const mod = require('maplibre-gl/dist/maplibre-gl.js');
        maplibregl = mod.default || mod;
      } catch (e) {
        console.error('Failed to require maplibre-gl for marker:', e);
        return;
      }

      const marker = new maplibregl.Marker({
        element: container,
        anchor: 'center',
        rotationAlignment: 'map',
      })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(map);

      userMarkerRef.current = marker;
    } else {
      userMarkerRef.current.setLngLat([userLocation.longitude, userLocation.latitude]);
    }
  }, [userLocation, mapRef.current]);

  // Sync User Heading on Web Map
  useEffect(() => {
    if (userConeRef.current) {
      if (userHeading !== null) {
        userConeRef.current.style.display = 'block';
        userConeRef.current.style.transform = `rotate(${userHeading}deg)`;
      } else {
        userConeRef.current.style.display = 'none';
      }
    }
  }, [userHeading]);

  const handleLocateUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.easeTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 15,
      });
    }
  };

  const handleResetBearing = () => {
    if (mapRef.current) {
      mapRef.current.easeTo({
        bearing: 0,
        pitch: 0,
      });
    }
  };

  return (
    <View style={styles.container}>
      <div
        ref={mapContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Floating Map Controls on Web */}
      <MapControls
        onLocateUser={handleLocateUser}
        onResetBearing={handleResetBearing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f3f4f6',
  },
});
