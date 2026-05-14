import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { STORAGE_KEYS } from '../constants/storageKeys';
import { getErrorMessage } from '../utils/errorMessage';

export type CartItem = {
  id: string;
  name: string;
  subtitle?: string;
  image?: string;
  quantity: number;
  price: number;
};

function isCartItem(x: unknown): x is CartItem {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    typeof o.quantity === 'number' &&
    typeof o.price === 'number' &&
    Number.isFinite(o.quantity) &&
    Number.isFinite(o.price)
  );
}

function parseCartJson(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(isCartItem);
  } catch {
    return [];
  }
}

type CartContextType = {
  cart: CartItem[];
  cartHydrated: boolean;
  cartTotal: number;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.CART_V1);
        if (!cancelled) {
          setCart(parseCartJson(raw));
        }
      } catch (error) {
        console.warn('Cart load:', getErrorMessage(error));
      } finally {
        if (!cancelled) setCartHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!cartHydrated) return;
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.CART_V1, JSON.stringify(cart));
      } catch (error) {
        console.warn('Cart save:', getErrorMessage(error));
      }
    })();
  }, [cart, cartHydrated]);

  const addItem: CartContextType['addItem'] = useCallback((item, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const increaseQty = useCallback((id: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  }, []);

  const decreaseQty = useCallback((id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      cartHydrated,
      cartTotal,
      addItem,
      increaseQty,
      decreaseQty,
      removeItem,
      clearCart,
    }),
    [cart, cartHydrated, cartTotal, addItem, increaseQty, decreaseQty, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
