"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import OrderSummary from '@/app/(user)/payments/_components/OrderSummary';
import PaymentActions from '@/app/(user)/payments/_components/PaymentActions';
import SuccessModal from '@/app/(user)/payments/_components/SuccessModal';
import { Order } from '@/types';
import Navigation from '@/components/Navigation';

const PaymentPage: React.FC = () => {
  // Dùng `useParams` một lần và lấy orderId từ đó
  const params = useParams();
  const orderId = params.orderId as string; // <-- SỬA LẠI: Lấy orderId theo cách của Next.js

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true); // <-- SỬA LẠI: Bắt đầu với trạng thái loading
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      setError("Không tìm thấy mã đơn hàng.");
      return;
    }

    const fetchOrderData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // <-- SỬA LẠI: Gọi 2 API cùng lúc để lấy cả order và order details
        const [orderRes, detailsRes] = await Promise.all([
          fetch(`http://localhost:8080/api/v1/order/${orderId}`),
          fetch(`http://localhost:8080/api/v1/oder-detail?order_id=${orderId}`)
        ]);

        if (!orderRes.ok || !detailsRes.ok) {
          throw new Error('Không thể tải được thông tin đơn hàng.');
        }

        const orderResult = await orderRes.json();
        const detailsResult = await detailsRes.json();

        // Kết hợp dữ liệu từ 2 API call thành 1 object duy nhất
        const combinedOrder: Order = {
          _id: orderResult._id,
          total_price: orderResult.total_price,
          items: detailsResult.data, // Gán danh sách món ăn từ API order-detail
        };
        
        setOrder(combinedOrder);

      } catch (err: any) {
        console.error("Lỗi khi fetch chi tiết đơn hàng:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handleConfirmPayment = async () => {
    // Dùng orderId trực tiếp từ params cho an toàn
    if (!orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      // <-- SỬA LẠI: Gọi đúng endpoint và phương thức PATCH để trừ kho
      const response = await fetch(`http://localhost:8080/api/v1/order/${orderId}/confirm-payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Xác nhận thanh toán thất bại.');
      }

      setShowSuccessModal(true);

    } catch (err: any) {
      setError(err.message);
      console.error('Lỗi khi xác nhận thanh toán:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Hiển thị trạng thái loading và lỗi
  if (isLoading) {
    return <div>Đang tải thông tin đơn hàng...</div>;
  }

  if (error) {
    return <div className="error-message">Lỗi: {error}</div>;
  }

  return (
    <div className="payment-page">
      <Navigation></Navigation>
      <h1>Xác nhận Thanh toán</h1>
      <OrderSummary order={order} />
      <PaymentActions
        onConfirm={handleConfirmPayment}
        isLoading={isLoading}
      />
      {error && <p className="error-message">{error}</p>}
      <SuccessModal show={showSuccessModal} orderId={orderId}/>
    </div>
  );
};

export default PaymentPage;