"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  show: boolean;
  orderId: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ show, orderId }) => {
  const router = useRouter();

  if (!show) {
    return null;
  }

  const handleViewOrder = () => {
    router.push(`/order-details/${orderId}`); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Đặt đồ ăn thành công!</h2>
        <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được chuẩn bị.</p>
        <button onClick={handleViewOrder}> 
          Xem chi tiết đơn hàng
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;