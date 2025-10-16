'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import { Card, Typography, Spin, Table, Tag, App } from 'antd';

const { Title, Text } = Typography;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface Payment {
  _id: string;
  order_id: string;
  method: string;
  amount: number;
  status: string;
  createdAt: string;
}

const PaymentHistoryContent = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { message } = App.useApp();

  useEffect(() => {
    if (!user?._id) {
        setLoading(false);
        return;
    }
    
    const fetchPayments = async () => {
      try {
        const response = await axios.get<Payment[]>(`${API_URL}/payment/user/${user._id}`);
        // 4. Thêm fallback `|| []` để đảm bảo `response.data` luôn là một mảng
        setPayments(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử thanh toán:", error);
        message.error('Lỗi khi tải lịch sử thanh toán. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
    
  }, [user, message]);

  const columns = [
    {
      title: 'Mã Đơn hàng',
      dataIndex: 'order_id',
      key: 'order_id',
      render: (text: string) => <Text copyable>{text}</Text>
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => {
        let text = 'Tiền mặt';
        if (method === 'cash_on_delivery') text = 'Thanh toán khi nhận hàng';
        return <Text>{text}</Text>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Ngày giao dịch',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>Lịch sử Thanh toán</Title>
        <Table
          dataSource={payments}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

const PaymentHistoryPage = () => {
  return (
    <ProtectedRoute>
      <PaymentHistoryContent />
    </ProtectedRoute>
  );
};

export default PaymentHistoryPage;