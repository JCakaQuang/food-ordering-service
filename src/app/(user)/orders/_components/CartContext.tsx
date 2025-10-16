"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { FoodItem } from '@/types';
import { App, message } from 'antd';

export interface CartItem extends FoodItem {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (food: FoodItem) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProviderContent = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const { message } = App.useApp();

  const addToCart = (food: FoodItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === food._id);
      if (existingItem) {
        return prevItems.map(item =>
          item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...food, quantity: 1 }];
    });

    message.success(`${food.name} đã được thêm vào giỏ hàng!`);
  };

  const removeFromCart = (foodId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== foodId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  return (
    <App>
      <CartProviderContent>{children}</CartProviderContent>
    </App>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};