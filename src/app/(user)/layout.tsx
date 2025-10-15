'use client'; // Rất quan trọng: Layout này chứa Provider, nên phải là Client Component

import React from 'react';
// Đảm bảo đường dẫn import chính xác đến file CartContext của bạn
import { CartProvider } from './orders/_components/CartContext'; 

export default function UserPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Bọc toàn bộ các trang trong thư mục (user) bằng CartProvider
    // Giờ đây, mọi page.tsx bên trong (user) đều có thể sử dụng hook useCart()
    <CartProvider>
      {children}
    </CartProvider>
  );
}
