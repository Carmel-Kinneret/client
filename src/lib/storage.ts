import { StateStorage } from 'zustand/middleware';

interface SafeStorage {
  set: (key: string, value: string) => void;
  getString: (key: string) => string | undefined;
  delete: (key: string) => void;
}

let storage: SafeStorage;

try {
  // Check if MMKV is available at runtime
  const { MMKV } = require('react-native-mmkv');
  storage = new MMKV({
    id: 'map-app-storage',
  });
} catch (e) {
  // Fallback to simple in-memory storage for Expo Go / web
  console.warn('MMKV not available in this environment. Falling back to in-memory storage.');
  const map = new Map<string, string>();
  storage = {
    set: (key: string, value: string) => {
      map.set(key, value);
    },
    getString: (key: string) => {
      return map.get(key);
    },
    delete: (key: string) => {
      map.delete(key);
    },
  };
}

export { storage };

// Adapter for Zustand persist middleware
export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};
