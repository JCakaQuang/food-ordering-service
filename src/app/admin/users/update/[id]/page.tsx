'use client';

import React, { useEffect, useState } from 'react';
import UserForm from '../../_components/form'; // Giả định form component nằm ở đây
import { message, Spin, Typography } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';

const { Title } = Typography;

// Hàm fetcher cho SWR, có khả năng gửi token xác thực
const fetcher = async ([url, token]: [string, string | null]) => {
  if (!token) {
    throw new Error('Not authenticated');
  }
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Gắn thêm thông tin vào đối tượng lỗi
    throw error;
  }
  return res.json();
};

const UpdateUserPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const [token, setToken] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Kiểm tra quyền admin và lấy token khi component được mount
    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        const storedUser = JSON.parse(localStorage.getItem('user_info') || '{}');

        if (!storedToken || storedUser.role !== 'admin') {
            message.error('Bạn không có quyền truy cập trang này.');
            router.push('/auth/login');
        } else {
            setToken(storedToken);
        }
    }, [router]);

    // Fetch dữ liệu bằng SWR, chỉ fetch khi có ID và token
    const { data: initialData, error, isLoading } = useSWR(
        id && token ? [`http://localhost:8080/api/v1/users/${id}`, token] : null,
        fetcher
    );

    const handleUpdate = async (values: any) => {
        // Nếu password rỗng, không gửi nó trong payload để tránh ghi đè mật khẩu cũ
        if (!values.password) {
            delete values.password;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/api/v1/users/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Gửi token xác thực
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Cập nhật thất bại.");
            }
            
            message.success("Cập nhật người dùng thành công!");
            router.push('/admin/users');
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !token) {
        return <Spin size="large" style={{ display: 'block', marginTop: 50 }} />;
    }
    
    if (error) {
        return <p>Không thể tải dữ liệu người dùng. Vui lòng thử lại.</p>;
    }

    return (
        <div>
            <Title level={2}>Cập nhật người dùng</Title>
            {initialData && (
                 <UserForm 
                    initialData={initialData}
                    onSubmit={handleUpdate}
                    isSubmitting={isSubmitting}
                 />
            )}
        </div>
    );
};

export default UpdateUserPage;