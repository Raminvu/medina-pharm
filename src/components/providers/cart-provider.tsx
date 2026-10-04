"use client";

import { ReactNode } from "react";

import { useCartStore } from "@/store/cart-store";

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({
  children,
}: CartProviderProps) {
  return <>{children}</>;
}

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseItem = useCartStore(
    (state) => state.increaseItem,
  );
  const decreaseItem = useCartStore(
    (state) => state.decreaseItem,
  );
  const clearCart = useCartStore(
    (state) => state.clearCart,
  );

  const totalItems = items.reduce(
    (total, item) => total + item.count,
    0,
  );

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.count,
    0,
  );

  return {
    items,
    addItem,
    removeItem,
    increaseItem,
    decreaseItem,
    clearCart,
    totalItems,
    totalPrice,
  };
}