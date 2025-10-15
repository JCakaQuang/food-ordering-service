'use client';

import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Luôn gọi useEffect ở cấp cao nhất của component
  useEffect(() => {
    // Chỉ thực hiện kiểm tra sau khi đã xác thực xong (loading === false)
    if (!loading && !user) {
      // Nếu không có user, điều hướng đến trang đăng nhập
      router.push('/auth/login');
    }
  }, [user, loading, router]); // Effect này sẽ chạy lại khi user, loading, hoặc router thay đổi

  // 1. Nếu đang trong quá trình xác thực, hiển thị Spin
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // 2. Nếu xác thực xong và có user, hiển thị nội dung được bảo vệ
  if (user) {
    return <>{children}</>;
  }

  // 3. Nếu xác thực xong và không có user, không hiển thị gì cả
  // (useEffect ở trên sẽ lo việc điều hướng)
  return null;
};

export default ProtectedRoute;