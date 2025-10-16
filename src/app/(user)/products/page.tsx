"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Spin, Alert, FloatButton, Typography, Pagination } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import FoodCard from '@/app/(user)/products/_components/FoodCard';
import { FoodItem } from '@/types';
import ContentWrapper from '@/components/ContentWrapper';
import { useCart } from '@/app/(user)/orders/_components/CartContext';
import CartDrawer from '@/app/(user)/orders/_components/CartDrawer';

const { Title } = Typography;

interface ApiResponse {
    data: FoodItem[];
    meta: {
        current: number;
        pageSize: number;
        total: number;
    };
}

const FoodPage: React.FC = () => {
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { totalItems } = useCart();
    const [cartOpen, setCartOpen] = useState(false);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
    });

    const fetchFoods = async (page: number, pageSize: number) => {
        setLoading(true);
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/foods`;
            const response = await axios.get<ApiResponse>(apiUrl, {
                params: {
                    current: page,
                    pageSize: pageSize,
                }
            });

            const { data, meta } = response.data;

            setFoods(data);
            setPagination({
                current: meta.current,
                pageSize: meta.pageSize,
                total: meta.total,
            });

        } catch (err: any) {
            console.error("Lỗi khi fetch dữ liệu:", err);
            setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods(pagination.current, pagination.pageSize);
    }, []);

    const handlePageChange = (page: number, pageSize: number) => {
        fetchFoods(page, pageSize);
    };

    if (loading) {
        return <Spin size="large" style={{ display: 'block', marginTop: '20%' }} />;
    }

    if (error) {
        return <Alert message="Lỗi" description={error} type="error" showIcon />;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <ContentWrapper>
                <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
                    Danh Sách Món Ăn
                </Title>

                <Row gutter={[24, 24]}>
                    {Array.isArray(foods) && foods.map((food) => (
                        <Col key={food._id} xs={24} sm={12} md={8} lg={6}>
                            <FoodCard food={food} />
                        </Col>
                    ))}
                </Row>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={pagination.total}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>

                <FloatButton
                    icon={<ShoppingCartOutlined />}
                    type="primary"
                    badge={{ count: totalItems, color: 'red' }}
                    tooltip="Xem giỏ hàng"
                    onClick={() => setCartOpen(true)}
                />

                <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            </ContentWrapper>
        </div>
    );
};

export default FoodPage;