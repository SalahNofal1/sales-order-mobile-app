import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getProducts } from '../services/productService';

export type CartItem = {
  id: string;
  name: string;
  subtitle?: string;
  image?: string;
  quantity: number;
  price: number;
};

type CartContextType = {
  cart: CartItem[];
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeItem: (id: string) => void;
  getTotal: () => number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        const formatted = data.map((item) => ({
          id: item.id,
          name: item.name,
          subtitle: item.description || 'Product',
          price: Number(item.price) || 0,
          quantity: 1,
          image: item.image,
        }));
        setCart(formatted);
      } catch (error) {
        console.log('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  const increaseQty = (id: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const decreaseQty = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const getTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, increaseQty, decreaseQty, removeItem, getTotal, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
