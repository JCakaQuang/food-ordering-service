'use client';

import React from 'react';
import { Layout, Menu, Dropdown, Avatar, Space, Button, Spin } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '../app/context/AuthContext'; 

const { Header } = Layout;

// Menu cho người dùng thông thường
const userNavLinks = [
  { key: '/', label: <Link href="/">Trang chủ</Link> },
  { key: '/products', label: <Link href="/products">Danh sách món ăn</Link> },
  { key: '/foodtype', label: <Link href="/foodtype">Thực đơn</Link> },
  { key: '/orders/order-history', label: <Link href="/orders/order-history">Lịch sử đơn hàng</Link> },
  {key: 'payments/payment-history', label: <Link href="/payments/payment-history">Lịch sử thanh toán</Link>},

];

// Menu cho quản trị viên
const adminMenuItems = [
  { key: '/admin/products', icon: <AppstoreOutlined />, label: <Link href="/admin/products">Sản phẩm</Link> },
  { key: '/admin/foodtype', icon: <UnorderedListOutlined />, label: <Link href="/admin/foodtype">Loại món ăn</Link> },
  { key: '/admin/users', icon: <UserOutlined />, label: <Link href="/admin/users">Người dùng</Link> },
];

const Navigation = () => {
  const { user, loading, logout } = useAuth();
  const profileMenuItems: MenuProps['items'] = user ? [
    {
      key: 'profile',
      label: <Link href={user.role?.toLowerCase() === 'admin' ? '/admin/profile' : '/profile'}>
        Thông tin cá nhân
      </Link>,
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      onClick: logout, // Hàm logout từ useAuth hook
      danger: true,
    },
  ] : [];

  const getMenuItems = () => {
    if (loading) return [];
    
    if (user) {
      if (user.role?.toLowerCase() === 'admin') {
        return adminMenuItems;
      }
      return userNavLinks;
    }
    
    return [];
  };

  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '0 24px', 
      backgroundColor: 'white',
      borderBottom: '1px solid #f0f0f0' 
    }}>
      <div className="logo" style={{ color: 'black', marginRight: '24px', fontWeight: 'bold', fontSize: '20px' }}>
        <Link href="/">FoodLighting</Link>
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        items={getMenuItems()}
        style={{ flex: 1, borderBottom: 'none' }}
        disabled={loading} // Vô hiệu hóa menu khi đang tải
      />
      
      <div className="user-profile">
        {loading ? (
          <Spin /> // Hiển thị loading khi đang xác thực
        ) : user ? (
          // Chỉ hiển thị Dropdown khi có user
          <Dropdown menu={{ items: profileMenuItems }} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()} style={{cursor: 'pointer'}}>
              <Space>
                <Avatar icon={<UserOutlined />} />
                {user.name}
              </Space>
            </a>
          </Dropdown>
        ) : (
          // Hiển thị nút Đăng nhập/Đăng ký khi không có user
          <Space>
            <Button><Link href="/auth/login">Đăng nhập</Link></Button>
            <Button type="primary"><Link href="/auth/register">Đăng ký</Link></Button>
          </Space>
        )}
      </div>
    </Header>
  );
};

export default Navigation;