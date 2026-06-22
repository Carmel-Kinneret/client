import type { LocationPoint } from '@/src/types/location';

export const SAMPLE_LOCATIONS: LocationPoint[] = [
  {
    id: 'dead-sea-south',
    title: 'Dead Sea Viewpoint',
    description: 'Cliffside pull-off with a wide view across the water.',
    latitude: 31.4012,
    longitude: 35.3656,
    category: 'Scenic',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'galilee-summit',
    title: 'Sea of Galilee Ridge',
    description: 'Hilltop anchor point for the northern trail network.',
    latitude: 32.8019,
    longitude: 35.5871,
    category: 'Trail',
  },
  {
    id: 'jerusalem-garden',
    title: 'City Garden Loop',
    description: 'Short urban loop with shaded rest stops and water access.',
    latitude: 31.7683,
    longitude: 35.2137,
    category: 'Family',
  },
  {
    id: 'coastal-lagoon',
    title: 'Coastal Lagoon Marker',
    description: 'Flat bike-friendly access with a parking area nearby.',
    latitude: 32.0809,
    longitude: 34.7806,
    category: 'Cycling',
  },
];

export const SAMPLE_GOOGLE_MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=32.0809,34.7806';