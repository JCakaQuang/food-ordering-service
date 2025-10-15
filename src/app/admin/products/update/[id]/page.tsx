"use client";

import React, { useState, useEffect } from 'react';
import ProductForm from '../../_components/form';
import { message } from 'antd';
import { useRouter, useParams } from 'next/navigation';

const UpdateProductPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [initialData, setInitialData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchInitialData = async () => {
            try {
                // Giả sử API findOne của food trả về object food trực tiếp
                const response = await fetch(`http://localhost:8080/api/v1/foods/${id}`);
                const result = await response.json();
                setInitialData(result);
            } catch (error) {
                message.error("Không thể tải dữ liệu sản phẩm.");
            }
        };
        fetchInitialData();
    }, [id]);

    const handleUpdate = async (values: any) => {
        console.log('Attempting to update with values:', values);
        setIsSubmitting(true);
        try {
            const payload = {
                ...values,
                // Đảm bảo price và quantity luôn là kiểu number
                price: Number(values.price),
                quantity: Number(values.quantity),
            };

            // In ra để kiểm tra
            console.log('Attempting to update with payload:', payload);

            // --- BƯỚC 2: GỬI `payload` ĐÃ ĐƯỢC CHUYỂN ĐỔI ĐI ---
            const response = await fetch(`http://localhost:8080/api/v1/foods/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload), // Gửi payload thay vì values
            });

            if (!response.ok) {
                // Để xem lỗi chi tiết hơn từ backend
                const errorData = await response.json();
                console.error('Backend validation error:', errorData);
                throw new Error(errorData.message || "Cập nhật sản phẩm thất bại.");
            }

            message.success("Cập nhật sản phẩm thành công!");
            router.push('/admin/products');

        } catch (error: any) {
            message.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!initialData) return <p>Đang tải dữ liệu...</p>;

    return (
        <div>
            <h1>Cập nhật sản phẩm</h1>
            <ProductForm
                initialData={initialData}
                onSubmit={handleUpdate}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default UpdateProductPage;