"use client";

import React from 'react';
import UserForm from '../../_components/form';
import { message } from 'antd';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr'; // Dùng SWR để fetch data hiệu quả hơn

// Hàm fetcher cho SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

const UpdateUserPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    // Fetch dữ liệu bằng SWR
    const { data: initialData, error, isLoading } = useSWR(id ? `http://localhost:8080/api/v1/users/${id}` : null, fetcher);

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleUpdate = async (values: any) => {
        // Nếu password rỗng, không gửi nó trong payload
        if (!values.password) {
            delete values.password;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/api/v1/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error("Cập nhật thất bại.");
            message.success("Cập nhật người dùng thành công!");
            router.push('/admin/users');
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Không thể tải dữ liệu người dùng.</p>;

    return (
        <div>
            <h1>Cập nhật người dùng</h1>
            <UserForm 
                initialData={initialData}
                onSubmit={handleUpdate}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default UpdateUserPage;