import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage';

interface FavoritesState {
  favoriteIds: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      addFavorite: (id) =>
        set((state) => ({
          favoriteIds: [...new Set([...state.favoriteIds, id])],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((favId) => favId !== id),
        })),
      toggleFavorite: (id) => {
        const state = get();
        if (state.isFavorite(id)) {
          state.removeFavorite(id);
        } else {
          state.addFavorite(id);
        }
      },
      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
