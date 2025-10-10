import React from 'react';
import { Order } from '@/types';

interface OrderSummaryProps {
  order: Order | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  if (!order) {
    return <div>Đang tải thông tin đơn hàng...</div>;
  }

  return (
    <div className="order-summary">
      <h2>Tóm tắt đơn hàng</h2>
      {order.items.map((item, index) => (
        <div key={index} className="order-item">
          <span>{item.food_id.name} (x{item.quantity})</span>
          <span>{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)} đ</span>
        </div>
      ))}
      <hr />
      <div className="order-total">
        <strong>Tổng cộng:</strong>
        <strong>{new Intl.NumberFormat('vi-VN').format(order.total_price)} đ</strong>
      </div>
    </div>
  );
};

export default OrderSummary;