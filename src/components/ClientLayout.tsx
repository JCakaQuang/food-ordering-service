"use client"; // Đánh dấu đây là Client Component

import { useEffect } from 'react';

// Component này sẽ chứa tất cả logic chỉ chạy trên trình duyệt
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    // Đặt logic gây ra lỗi hydration của bạn ở đây.
    // Ví dụ: khởi tạo thư viện Material Design Lite
    console.log("ClientLayout mounted, safe to run client-side scripts.");
  }, []);

  // Component này chỉ đơn giản là render ra các con của nó
  return <>{children}</>;
}