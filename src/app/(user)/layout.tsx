'use client';
import React from 'react';
import { CartProvider } from './orders/_components/CartContext'; 

export default function UserPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
