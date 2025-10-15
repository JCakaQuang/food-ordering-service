"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { OrderItem } from '@/types';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

const OrderDetailsPage = () => {
    const router = useRouter();

    const params = useParams();
    const orderId = params.orderId as string;

    const [details, setDetails] = useState<OrderItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleBackHome = () => {
        router.push(`/`);
    };

    useEffect(() => {
        if (!orderId) return;

        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                // Gọi API để lấy tất cả các `order detail` thuộc về `orderId` này
                const response = await fetch(`http://localhost:8080/api/v1/oder-detail?order_id=${orderId}`);
                if (!response.ok) {
                    throw new Error("Không thể tải chi tiết đơn hàng.");
                }
                const result = await response.json();
                setDetails(result.data); // result.data là một mảng các món ăn
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [orderId]);

    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Lỗi: {error}</div>;

    return (
        <div>
            <h1>Chi tiết đơn hàng: {orderId}</h1>
            <ul>
                {details.map((item, index) => (
                    <li key={index}>
                        {/* Giả sử backend đã populate và trả về tên món ăn */}
                        {item.food_id.name} - Số lượng: {item.quantity} - Giá: {item.price}đ
                    </li>
                ))}
            </ul>
            <button onClick={handleBackHome}>Quay về trang chủ</button>
        </div>
    );
};

export default OrderDetailsPage;