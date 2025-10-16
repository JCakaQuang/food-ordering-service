'use client';

import React, { useState } from 'react';
import { Drawer, List, Button, Typography, Avatar, message } from 'antd';
import { useCart } from '@/app/(user)/orders/_components/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const { Title } = Typography;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';


const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const CartDrawer: React.FC<{ open: boolean; onClose: () => void; }> = ({ open, onClose }) => {
  const { cartItems, clearCart, totalPrice, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để tiếp tục thanh toán!');
      router.push('/auth/login');
      return;
    }
    
    if (cartItems.length === 0) {
      message.error("Giỏ hàng của bạn đang trống!");
      return;
    }

    setIsCheckingOut(true);

    try {
      const orderData = {
        user_id: user._id,
        status: "pending",
        total_price: totalPrice,
      };

      const orderResponse = await axios.post(`${API_URL}/order`, orderData);
      const newOrder = orderResponse.data as { _id: string };
      const order_id = newOrder._id;
      
      if (!order_id) {
        throw new Error('Không nhận được ID đơn hàng từ phản hồi của API.');
      }

      const orderDetailPromises = cartItems.map(item => {
        const orderDetailData = {
          order_id: order_id,
          food_id: item._id,
          quantity: item.quantity,
          price: item.price || 0,
        };
        return axios.post(`${API_URL}/oder-detail`, orderDetailData);
      });

      await Promise.all(orderDetailPromises);

      message.success('Tạo đơn hàng thành công! Đang chuyển đến trang thanh toán...');
      clearCart();
      router.push(`/payments/${order_id}`);

    } catch (error: any) {
      console.error("Lỗi khi thanh toán:", error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Drawer
      title="Giỏ hàng của bạn"
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Title level={4}>Tổng cộng: {formatCurrency(totalPrice)}</Title>
          <Button
            onClick={handleCheckout}
            type="primary"
            size="large"
            loading={isCheckingOut}
          >
            Thanh Toán
          </Button>
        </div>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={cartItems}
        renderItem={(item) => (
          <List.Item
            actions={[<Button type="link" danger onClick={() => removeFromCart(item._id)}>Xóa</Button>]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.image} />}
              title={item.name}
              description={`Số lượng: ${item.quantity} - Giá: ${formatCurrency(item.price || 0)}`}
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
};

export default CartDrawer;