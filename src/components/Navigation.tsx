"use client"; // Chuyển thành Client Component để dùng hook

import React from 'react';
import { Layout, Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header } = Layout;

// 1. Cập nhật dữ liệu menu để chứa cả đường dẫn (path)
const navLinks = [
  {
    key: '1',
    label: 'Trang chủ',
    path: '/',
  },
  {
    key: '2',
    label: 'Sản phẩm',
    path: '/products',
  },
  {
    key: '3',
    label: 'Danh mục sản phẩm',
    path: '/foodtype',
  },
  {
    key: '4',
    label: 'Lịch sử đặt hàng',
    path: '/orders/order-history',
  },
  {
    key: '5',
    label: 'Lịch sử thanh toán',
    path: '/payments/payment-history',
  }
];

// 2. Chuyển đổi dữ liệu để bọc label trong component <Link>
const navItems = navLinks.map(link => ({
  key: link.key,
  label: <Link href={link.path}>{link.label}</Link>,
}));


const Navigation: React.FC = () => {
  // 3. Lấy đường dẫn hiện tại để xác định menu item nào đang active
  const pathname = usePathname();
  const activeKey = navLinks.find(link => link.path === pathname)?.key;

  return (
    <Header style={{ display: 'flex', alignItems: 'center' }}>
      <div className="demo-logo" /> {/* Bạn có thể thay logo vào đây */}
      <Menu
        theme="dark"
        mode="horizontal"
        // 4. Sử dụng `selectedKeys` để tự động highlight menu
        selectedKeys={activeKey ? [activeKey] : []}
        items={navItems}
        style={{ flex: 1, minWidth: 0 }}
      />
    </Header>
  );
};

export default Navigation;