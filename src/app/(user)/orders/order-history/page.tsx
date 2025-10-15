'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import { Card, Typography, Spin, Collapse, List, Avatar, Tag, message } from 'antd';
import type { CollapseProps } from 'antd';

const { Title, Text } = Typography;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

interface Food {
  _id: string;
  name: string;
  image: string;
}

interface OrderDetail {
  _id: string;
  food_id: Food;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  status: string;
  total_price: number;
  createdAt: string;
}

interface DetailsApiResponse {
    data: OrderDetail[];
    meta: object;
}

const OrderDetails = ({ orderId }: { orderId: string }) => {
  const [details, setDetails] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {

        const response = await axios.get<DetailsApiResponse>(`${API_URL}/oder-detail?order_id=${orderId}`);

        setDetails(response.data.data || []);
      } catch (error) {
        message.error('Lỗi khi tải chi tiết đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [orderId]);

  if (loading) return <Spin />;

  return (
    <List
      itemLayout="horizontal"
      dataSource={details}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={item.food_id?.image || '/placeholder.png'} />}
            title={item.food_id?.name || 'Món ăn không xác định'}
            description={`Số lượng: ${item.quantity} - Giá: ${item.price.toLocaleString('vi-VN')} VNĐ`}
          />
          <div>Tổng: {(item.quantity * item.price).toLocaleString('vi-VN')} VNĐ</div>
        </List.Item>
      )}
    />
  );
};

const OrderHistoryContent = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get<Order[]>(`${API_URL}/order/history/by-user/${user._id}`);
          setOrders(response.data || []);
        } catch (error) {
          message.error('Lỗi khi tải lịch sử đơn hàng');
          setOrders([]);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    } else if (!user) {
        setLoading(false);
    }
  }, [user]);
  
  // SỬA LỖI Ở ĐÂY: Chuyển đổi mảng `orders` thành cấu trúc `items` mà Collapse yêu cầu
  const collapseItems: CollapseProps['items'] = orders.map((order) => ({
    key: order._id,
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Text strong>Mã đơn: {order._id}</Text>
        <Text>Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</Text>
        <Tag color={order.status === 'paid' ? 'green' : 'gold'}>{order.status}</Tag>
      </div>
    ),
    children: (
      <>
        <OrderDetails orderId={order._id} />
        <div style={{ textAlign: 'right', marginTop: '16px' }}>
          <Title level={5}>
            Tổng cộng: {order.total_price.toLocaleString('vi-VN')} VNĐ
          </Title>
        </div>
      </>
    ),
  }));


  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>Lịch sử Đơn hàng</Title>
        {orders.length > 0 ? (
          // Thay thế cách dùng cũ bằng thuộc tính `items`
          <Collapse accordion items={collapseItems} />
        ) : (
          <Text>Bạn chưa có đơn hàng nào.</Text>
        )}
      </Card>
    </div>
  );
};

const OrderHistoryPage = () => {
  return (
    <ProtectedRoute>
      <OrderHistoryContent />
    </ProtectedRoute>
  );
};

export default OrderHistoryPage;