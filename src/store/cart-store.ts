"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  slug: string;
  brand: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  quantity: string;
  count: number;
};

type CartStore = {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "count">) => void;
  removeItem: (id: number) => void;
  increaseItem: (id: number) => void;
  decreaseItem: (id: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.id === item.id,
          );

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? {
                      ...cartItem,
                      count: cartItem.count + 1,
                    }
                  : cartItem,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                count: 1,
              },
            ],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== id,
          ),
        }));
      },

      increaseItem: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  count: item.count + 1,
                }
              : item,
          ),
        }));
      },

      decreaseItem: (id) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    count: item.count - 1,
                  }
                : item,
            )
            .filter((item) => item.count > 0),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "medina-pharm-cart",
    },
  ),
);