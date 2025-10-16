'use client';

import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Chỉ thực hiện kiểm tra sau khi đã xác thực xong (loading === false)
    if (!loading && !user) {
      // Nếu không có user, điều hướng đến trang đăng nhập
      router.push('/auth/login');
    }
  }, [user, loading, router]); // Effect này sẽ chạy lại khi user, loading, hoặc router thay đổi

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }
  return null;
};

export default ProtectedRoute;