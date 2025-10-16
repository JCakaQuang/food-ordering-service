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

      <Button type="primary" onClick={showCartDrawer}>
        Xem Giỏ Hàng
      </Button>

      <CartDrawer open={isCartOpen} onClose={closeCartDrawer} />
    </div>
  );
};

export default OrderPage;