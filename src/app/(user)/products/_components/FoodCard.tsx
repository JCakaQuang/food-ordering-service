import React from 'react';

import { Card, Typography, Button, Tag } from 'antd'; 
import { ShoppingCartOutlined, PictureOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { FoodItem } from '@/types';
import { useCart } from '@/app/(user)/orders/_components/CartContext'; 

interface FoodCardProps {
  food: FoodItem;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const isValidImageUrl = (url?: string): boolean => {
  if (!url) return false;
  return url.startsWith('http') || url.startsWith('/');
};

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const hasValidImage = isValidImageUrl(food.image);
  const { addToCart } = useCart();

  const isOutOfStock = (food.quantity ?? 0) <= 0;

  return (
    <Card
      hoverable
      style={{ width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
      styles={{
        body: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
      cover={
        hasValidImage ? (
          <Image
            alt={food.name}
            src={food.image!}
            width={500}
            height={300}
            style={{ objectFit: 'cover' }}
            priority
          />
        ) : (
          <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
            <PictureOutlined style={{ fontSize: 50, color: '#ccc' }} />
          </div>
        )
      }
    >
      {isOutOfStock && (
        <Tag color="red" style={{ position: 'absolute', top: 16, right: 16 }}>
          Hết hàng
        </Tag>
      )}

      <div>
        <Typography.Title level={5} style={{ minHeight: 48 }}>
          {food.name}
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Số lượng còn lại: {food.quantity}
        </Typography.Paragraph>

        <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
          {food.description || 'Món ăn đặc sắc'}
        </Typography.Paragraph>
      </div>

      <div>
        <Typography.Text style={{ fontSize: '1.5rem', color: '#c92127', fontWeight: 'bold' }}>
          {food.price ? formatCurrency(food.price) : 'Liên hệ'}
        </Typography.Text>

        <Button
          type="primary"
          danger
          icon={<ShoppingCartOutlined />}
          style={{ width: '100%', marginTop: 16 }}
          onClick={() => addToCart(food)}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Hết hàng" : "Đặt Món"}
        </Button>
      </div>
    </Card>
  );
};

export default FoodCard;