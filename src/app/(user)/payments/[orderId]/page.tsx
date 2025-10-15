"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import OrderSummary from '@/app/(user)/payments/_components/OrderSummary';
import PaymentActions from '@/app/(user)/payments/_components/PaymentActions';
import SuccessModal from '@/app/(user)/payments/_components/SuccessModal';
import { Order } from '@/types';
import Navigation from '@/components/Navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const PaymentPage: React.FC = () => {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
        const [orderRes, detailsRes] = await Promise.all([
          axios.get(`${API_URL}/order/${orderId}`),
          axios.get(`${API_URL}/oder-detail?order_id=${orderId}`)
        ]);

        const orderData = orderRes.data as { _id: string; total_price: number };
        const detailsData = detailsRes.data as { data: Order['items'] };

        const combinedOrder: Order = {
          _id: orderData._id,
          total_price: orderData.total_price,
          items: detailsData.data, 
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
    if (!orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      await axios.patch(`${API_URL}/order/${orderId}/confirm-payment`);
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Xác nhận thanh toán thất bại.');
      console.error('Lỗi khi xác nhận thanh toán:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <div>Đang tải thông tin đơn hàng...</div>;
  }

  if (error) {
    return <div className="error-message">Lỗi: {error}</div>;
  }

  return (
    <div className="payment-page">
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