"use client"; // Cần thiết để sử dụng useState và useEffect

import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Alert, FloatButton, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import FoodCard from '@/components/FoodCard';
import { FoodItem } from '@/types';
import Navigation from '@/components/Navigation';
import ContentWrapper from '@/components/ContentWrapper';
import Footerapp from '@/components/Footer';

const { Title } = Typography;


const FoodPage: React.FC = () => {
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/foods');
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến máy chủ');
                }
                const responseData = await response.json(); // Đổi tên biến để rõ ràng hơn

                // QUAN TRỌNG: Truy cập vào thuộc tính 'data' của đối tượng trả về
                if (responseData && Array.isArray(responseData.data)) {
                    setFoods(responseData.data); // Chỉ lấy mảng foods từ responseData.data
                } else {
                    setFoods([]); // Nếu không có data thì set mảng rỗng
                    console.warn("API did not return an array in the 'data' property:", responseData);
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFoods();
    }, []);// Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần

    if (loading) {
        return <Spin size="large" style={{ display: 'block', marginTop: '20%' }} />;
    }

    if (error) {
        return <Alert message="Lỗi" description={error} type="error" showIcon />;
    }

    return (
        <div style={{ padding: '50px' }}>
            <Navigation></Navigation>

            <ContentWrapper>
                <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
                    Thực đơn hấp dẫn
                </Title>

                <Row gutter={[24, 24]}>
                    {/* 2. Thêm điều kiện kiểm tra Array.isArray() trước khi map */}
                    {Array.isArray(foods) && foods.map((food) => (
                        <Col key={food._id} xs={24} sm={12} md={8} lg={6}>
                            <FoodCard food={food} />
                        </Col>
                    ))}
                </Row>

                {/* Nút giỏ hàng nổi */}
                <FloatButton
                    icon={<ShoppingCartOutlined />}
                    type="primary"
                    badge={{ count: 1, color: 'red' }} // Ví dụ có 1 món trong giỏ
                    tooltip="Xem giỏ hàng"
                />
            </ContentWrapper>

            <Footerapp />
        </div>
    );
};

export default FoodPage;