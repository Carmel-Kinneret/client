import { create } from 'zustand';

interface SettingsState {
  isDarkMode: boolean;
  locationEnabled: boolean;
  mapStyle: 'Standard' | 'Satellite' | 'Terrain';
  setDarkMode: (val: boolean) => void;
  setLocationEnabled: (val: boolean) => void;
  setMapStyle: (val: 'Standard' | 'Satellite' | 'Terrain') => void;
  clearImageCache: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isDarkMode: false,
  locationEnabled: true,
  mapStyle: 'Standard',
  setDarkMode: (val) => set({ isDarkMode: val }),
  setLocationEnabled: (val) => set({ locationEnabled: val }),
  setMapStyle: (val) => set({ mapStyle: val }),
  clearImageCache: () => {
    // In a real app this would clear FastImage cache or filesystem cache
    console.log('Image cache cleared!');
  },
}));
