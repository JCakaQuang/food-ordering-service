"use client";

import React, { useState } from 'react';
import { Button } from 'antd';
import CartDrawer from './_components/CartDrawer';

const OrderPage = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const showCartDrawer = () => {
    setIsCartOpen(true);
  };

  const closeCartDrawer = () => {
    setIsCartOpen(false);
  };

  return (
    <div>
      <h1>Trang Đặt Hàng</h1>
      <p>Chọn món ăn của bạn và thêm vào giỏ hàng.</p>
      
      {/* Nút này sẽ mở giỏ hàng */}
      <Button type="primary" onClick={showCartDrawer}>
        Xem Giỏ Hàng
      </Button>

      {/* Component giỏ hàng được render ở đây */}
      <CartDrawer open={isCartOpen} onClose={closeCartDrawer} />

      {/* Hiển thị danh sách món ăn (FoodCard) của bạn ở đây */}
    </div>
  );
};

export default OrderPage;