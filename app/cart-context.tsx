'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type CartState = Record<number, number>;

interface CartContextValue {
  items: CartState;
  totalItems: number;
  addItem: (medicineId: number, quantity?: number) => void;
  updateItem: (medicineId: number, quantity: number) => void;
  removeItem: (medicineId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartState>(() => {
    if (typeof window !== 'undefined') {
      const storedCart = window.localStorage.getItem('cartItems');
      if (storedCart) {
        try {
          return JSON.parse(storedCart);
        } catch {
          return {};
        }
      }
    }
    return {};
  });

  useEffect(() => {
    window.localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const addItem = (medicineId: number, quantity = 1) => {
    setItems((prev) => {
      const nextQuantity = (prev[medicineId] || 0) + quantity;
      if (nextQuantity <= 0) {
        const nextItems = { ...prev };
        delete nextItems[medicineId];
        return nextItems;
      }
      return { ...prev, [medicineId]: nextQuantity };
    });
  };

  const updateItem = (medicineId: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        const nextItems = { ...prev };
        delete nextItems[medicineId];
        return nextItems;
      }
      return { ...prev, [medicineId]: quantity };
    });
  };

  const removeItem = (medicineId: number) => {
    setItems((prev) => {
      const nextItems = { ...prev };
      delete nextItems[medicineId];
      return nextItems;
    });
  };

  const clearCart = () => setItems({});

  const totalItems = useMemo(
    () => Object.values(items).reduce((sum, value) => sum + value, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, totalItems, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
