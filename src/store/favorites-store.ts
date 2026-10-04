"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesStore = {
  favoriteIds: number[];

  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  removeFavorite: (id: number) => void;
  clearFavorites: () => void;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (id) => {
        set((state) => {
          const isFavorite = state.favoriteIds.includes(id);

          return {
            favoriteIds: isFavorite
              ? state.favoriteIds.filter(
                  (favoriteId) => favoriteId !== id,
                )
              : [...state.favoriteIds, id],
          };
        });
      },

      isFavorite: (id) => {
        return get().favoriteIds.includes(id);
      },

      removeFavorite: (id) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.filter(
            (favoriteId) => favoriteId !== id,
          ),
        }));
      },

      clearFavorites: () => {
        set({ favoriteIds: [] });
      },
    }),
    {
      name: "medina-pharm-favorites",
    },
  ),
);