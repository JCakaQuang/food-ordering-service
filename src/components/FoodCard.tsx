import React from 'react';
import { Card, Typography, Button } from 'antd';
import { ShoppingCartOutlined, PictureOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { FoodItem } from '@/types';

interface FoodCardProps {
  food: FoodItem;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Hàm kiểm tra xem URL có hợp lệ không
const isValidImageUrl = (url?: string): boolean => {
  if (!url) return false;
  return url.startsWith('http') || url.startsWith('/');
};

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const hasValidImage = isValidImageUrl(food.image);

  return (
    <Card
      hoverable
      style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
      // SỬA LỖI 1: Đổi bodyStyle thành styles.body
      styles={{
        body: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
      cover={
        // SỬA LỖI 2: Kiểm tra URL hợp lệ trước khi dùng next/image
        hasValidImage ? (
          <Image
            alt={food.name}
            src={food.image!} // Dấu ! để báo cho TypeScript rằng chúng ta đã kiểm tra
            width={500}
            height={300}
            style={{ objectFit: 'cover' }}
            priority // Thêm priority cho ảnh ở màn hình đầu tiên để tải nhanh hơn
          />
        ) : (
          <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
            <PictureOutlined style={{ fontSize: 50, color: '#ccc' }} />
          </div>
        )
      }
    >
      <div>
        <Typography.Title level={5} style={{ minHeight: 48 }}>
          {food.name}
        </Typography.Title>

        {food.quantity && (
          <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
            {food.quantity}
          </Typography.Paragraph>
        )}
        
        {food.description && (
          <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
            {food.description}
          </Typography.Paragraph>
        )}
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
        >
          Đặt Hàng
        </Button>
      </div>
    </Card>
  );
};

export default FoodCard;