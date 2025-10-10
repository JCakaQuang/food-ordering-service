import React, { useState } from 'react';
import { Drawer, List, Button, Typography, Avatar, message } from 'antd';
import { useCart } from '@/app/(user)/products/_components/CartContext';
import { useRouter } from 'next/navigation'; // Import useRouter để chuyển trang

const { Title } = Typography;

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { cartItems, clearCart, totalPrice } = useCart();
  const router = useRouter(); // Khởi tạo router
  const [isCheckingOut, setIsCheckingOut] = useState(false); // State để xử lý loading

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      message.error("Giỏ hàng của bạn đang trống!");
      return;
    }

    setIsCheckingOut(true);

    try {
      const orderData = {
        user_id: "68e7099ad296e2b9139f75dd",
        status: "pending",
        total_price: totalPrice,
      };

      const orderResponse = await fetch('http://localhost:8080/api/v1/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) throw new Error('Tạo đơn hàng thất bại.');

      const newOrder = await orderResponse.json();

      const order_id = newOrder._id;

      // Kiểm tra để chắc chắn có order_id
      if (!order_id) {
        throw new Error('Không nhận được ID đơn hàng từ phản hồi của API.');
      }

      // BƯỚC 2: TẠO CÁC ORDER DETAILS (Giữ nguyên)
      const orderDetailPromises = cartItems.map(item => {
        const orderDetailData = {
          order_id: order_id,
          food_id: item._id,
          quantity: item.quantity,
          price: item.price || 0,
        };
        return fetch('http://localhost:8080/api/v1/oder-detail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderDetailData),
        });
      });

      const responses = await Promise.all(orderDetailPromises);

      if (responses.some(res => !res.ok)) {
        throw new Error('Lưu chi tiết đơn hàng thất bại.');
      }

      // BƯỚC 3: XỬ LÝ KHI THÀNH CÔNG
      message.success('Tạo đơn hàng thành công! Đang chuyển đến trang thanh toán...');
      clearCart();
      router.push(`/payments/${order_id}`);

    } catch (error: any) {
      console.error("Lỗi khi thanh toán:", error);
      message.error(error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  function removeFromCart(_id: string): void {
    throw new Error('Function not implemented.');
  }

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
            loading={isCheckingOut} // Thêm trạng thái loading cho nút
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