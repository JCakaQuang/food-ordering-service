"use client";

import React, { useState, useEffect } from 'react';
import { List, Typography, Tag } from 'antd';
import Navigation from '@/components/Navigation';

const { Title, Text } = Typography;

interface Payment {
    _id: string;
    amount: number;
    status: string;
    createdAt: string;
    order_id: string;
}

const PaymentHistoryPage = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Tạm thời hardcode userId
    const userId = "68e7099ad296e2b9139f75dd";

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/v1/payment/user/${userId}`);
                if (!response.ok) {
                    throw new Error("Không thể tải lịch sử thanh toán.");
                }
                const data = await response.json();
                setPayments(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentHistory();
    }, [userId]);

    if (isLoading) return <p>Đang tải lịch sử...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <Navigation></Navigation>
            <Title level={2}>Lịch sử Thanh toán</Title>
            <List
                itemLayout="horizontal"
                dataSource={payments}
                renderItem={(payment) => (
                    <List.Item>
                        <List.Item.Meta
                            title={`Giao dịch cho đơn hàng #${payment.order_id}`}
                            description={
                                <>
                                    <Text>Ngày thanh toán: {new Date(payment.createdAt).toLocaleString('vi-VN')}</Text><br/>
                                    <Text>Số tiền: {new Intl.NumberFormat('vi-VN').format(payment.amount)} đ</Text>
                                </>
                            }
                        />
                        <Tag color={payment.status === 'success' ? 'success' : 'error'}>{payment.status}</Tag>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default PaymentHistoryPage;