'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Row, Col, Spin, App, Typography, FloatButton, Badge } from 'antd';
import { FoodItem, FoodType } from '@/types'; // Import các kiểu dữ liệu chung
import FoodCard from '../products/_components/FoodCard'; // Tái sử dụng FoodCard
import CartDrawer from '../orders/_components/CartDrawer';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../orders/_components/CartContext';
import axios from 'axios';

const { Sider, Content } = Layout;
const { Title } = Typography;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface ApiResponse<T> {
    data: T[];
    meta: {
        current: number;
        pageSize: number;
        total: number;
    };
}

const MenuPage = () => {
    const [foodtypes, setFoodtypes] = useState<FoodType[]>([]);
    const [products, setProducts] = useState<FoodItem[]>([]);
    const [selectedFoodtypeId, setSelectedFoodtypeId] = useState<string | null>(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const { totalItems } = useCart();
    const { message } = App.useApp();

    useEffect(() => {
        const fetchFoodtypes = async () => {
            setIsLoadingCategories(true);
            try {
                const response = await axios.get<ApiResponse<FoodType>>(`${API_URL}/foodtype`);
                const result = response.data;
                if (result.data && result.data.length > 0) {
                    setFoodtypes(result.data);
                    setSelectedFoodtypeId(result.data[0]._id);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
                message.error("Không thể tải danh sách danh mục.");
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchFoodtypes();
    }, [message]);

    useEffect(() => {
        if (!selectedFoodtypeId) return;

        const fetchProducts = async () => {
            setIsLoadingProducts(true);
            try {
                const response = await axios.get<ApiResponse<FoodItem>>(`${API_URL}/foods`, {
                    params: { foodtype_id: selectedFoodtypeId }
                });
                setProducts(response.data.data || []);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
                message.error("Không thể tải danh sách sản phẩm.");
            } finally {
                setIsLoadingProducts(false);
            }
        };
        fetchProducts();
    }, [selectedFoodtypeId, message]);

    const handleMenuClick = (e: any) => {
        setSelectedFoodtypeId(e.key);
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#fff' }}>
            <Sider width={250} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
                <Title level={4} style={{ padding: '16px 24px' }}>Thực đơn</Title>
                {isLoadingCategories ? <Spin style={{ padding: '24px' }} /> : (
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedFoodtypeId || '']}
                        onClick={handleMenuClick}
                        items={foodtypes.map(ft => ({
                            key: ft._id,
                            label: ft.name,
                        }))}
                    />
                )}
            </Sider>
            <Content style={{ padding: '24px', background: '#f0f2f5' }}>
                {isLoadingProducts ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Spin size="large" />
                    </div>
                 ) : (
                    <Row gutter={[16, 16]}>
                        {products.length > 0 ? (
                            products.map(food => (
                                <Col key={food._id} xs={24} sm={12} md={8} lg={6}>
                                    <FoodCard food={food} />
                                </Col>
                            ))
                        ) : (
                            <div style={{width: '100%', textAlign: 'center', marginTop: 48}}>
                                <Typography.Text type="secondary">Không có sản phẩm nào trong danh mục này.</Typography.Text>
                            </div>
                        )}
                    </Row>
                )}
            </Content>

            <FloatButton
                icon={<ShoppingCartOutlined />}
                type="primary"
                badge={{ count: totalItems, color: 'red' }}
                tooltip="Xem giỏ hàng"
                onClick={() => setCartOpen(true)}
            />

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </Layout>
    );
};

export default MenuPage;
