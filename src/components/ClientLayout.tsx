"use client";

import { useEffect } from 'react';
import { CartProvider } from '@/app/(user)/orders/_components/CartContext'; // Import CartProvider

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    console.log("ClientLayout mounted, safe to run client-side scripts.");
  }, []);

  return (
    // Bọc children trong CartProvider
    <CartProvider>
      {children}
    </CartProvider>
  );
}