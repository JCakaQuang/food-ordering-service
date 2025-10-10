"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { FoodItem } from '@/types';
import { App, message } from 'antd';

// Định nghĩa một món hàng trong giỏ, kế thừa từ FoodItem và thêm số lượng
export interface CartItem extends FoodItem {
  quantity: number;
}

// Định nghĩa những gì Context sẽ cung cấp
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (food: FoodItem) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Bọc CartProvider bên trong một component mới để sử dụng hook
const CartProviderContent = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // SỬA Ở ĐÂY: Dùng useMessage hook
  const { message } = App.useApp(); // Lấy message API từ context của AntD

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
    // SỬA Ở ĐÂY: Dùng messageApi instance
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

// Component CartProvider chính sẽ bọc App Provider của AntD
export const CartProvider = ({ children }: { children: ReactNode }) => {
  return (
    <App>
      <CartProviderContent>{children}</CartProviderContent>
    </App>
  );
};


// Custom hook không đổi
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};