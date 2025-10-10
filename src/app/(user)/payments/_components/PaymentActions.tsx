import React from 'react';

interface PaymentActionsProps {
  onConfirm: () => void;
  isLoading: boolean;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({ onConfirm, isLoading }) => {
  return (
    <div className="payment-actions">
      <button 
        onClick={onConfirm} 
        disabled={isLoading} 
        className="confirm-button"
      >
        {isLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
      </button>
    </div>
  );
};

export default PaymentActions;