// app/order-history/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { List, Card, Typography, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

const { Text } = Typography;

// Định nghĩa kiểu dữ liệu cho một đơn hàng trong lịch sử
interface HistoryOrder {
  _id: string;
  status: string;
  total_price: number;
  createdAt: string; // Ngày đặt hàng
}

const OrderHistoryPage = () => {
    const router = useRouter();
    const [orders, setOrders] = useState<HistoryOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Tạm thời hardcode user_id, bạn sẽ lấy từ hệ thống đăng nhập
    const userId = "68e7099ad296e2b9139f75dd";

    useEffect(() => {
        const fetchOrderHistory = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/v1/order/history/by-user/${userId}`);
                if (!response.ok) {
                    throw new Error("Không thể tải lịch sử đơn hàng.");
                }
                const data = await response.json();
                setOrders(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderHistory();
    }, [userId]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    if (isLoading) return <Spin tip="Đang tải..." size="large" fullscreen />;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <Navigation></Navigation>
            <h1>Lịch sử đặt hàng</h1>
            <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
                dataSource={orders}
                renderItem={(order) => (
                    <List.Item>
                        <Card
                            title={`Đơn hàng #${order._id.slice(-6)}`}
                            hoverable
                            onClick={() => router.push(`/order-details/${order._id}`)}
                        >
                            <p><strong>Trạng thái:</strong> {order.status}</p>
                            <p><strong>Tổng tiền:</strong> {formatCurrency(order.total_price)}</p>
                            <Text type="secondary">Đặt lúc: {formatDate(order.createdAt)}</Text>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default OrderHistoryPage;