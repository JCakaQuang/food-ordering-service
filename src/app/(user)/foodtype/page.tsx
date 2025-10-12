"use client";

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Row, Col, Spin, message, Typography, FloatButton } from 'antd';
import { FoodItem, FoodType } from '@/types'; // Import các kiểu dữ liệu chung
import FoodCard from '../products/_components/FoodCard'; // Tái sử dụng FoodCard
import Footerapp from '@/components/Footer';
import Navigation from '@/components/Navigation';
import CartDrawer from '../orders/_components/CartDrawer';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../orders/_components/CartContext';

const { Sider, Content } = Layout;
const { Title } = Typography;

const MenuPage = () => {
    const [foodtypes, setFoodtypes] = useState<FoodType[]>([]);
    const [products, setProducts] = useState<FoodItem[]>([]);
    const [selectedFoodtypeId, setSelectedFoodtypeId] = useState<string | null>(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const { totalItems } = useCart();

    // Effect 1: Tải danh sách các danh mục (foodtype) khi component được mount
    useEffect(() => {
        const fetchFoodtypes = async () => {
            setIsLoadingCategories(true);
            try {
                const response = await fetch('http://localhost:8080/api/v1/foodtype');
                const result = await response.json();
                if (result.data && result.data.length > 0) {
                    setFoodtypes(result.data);
                    // Tự động chọn danh mục đầu tiên để hiển thị sản phẩm
                    setSelectedFoodtypeId(result.data[0]._id);
                }
            } catch (error) {
                message.error("Không thể tải danh sách danh mục.");
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchFoodtypes();
    }, []);

    // Effect 2: Tải danh sách sản phẩm mỗi khi danh mục được chọn thay đổi
    useEffect(() => {
        if (!selectedFoodtypeId) return;

        const fetchProducts = async () => {
            setIsLoadingProducts(true);
            try {
                const response = await fetch(`http://localhost:8080/api/v1/foods?foodtype_id=${selectedFoodtypeId}`);
                const result = await response.json();
                setProducts(result.data);
            } catch (error) {
                message.error("Không thể tải danh sách sản phẩm.");
            } finally {
                setIsLoadingProducts(false);
            }
        };
        fetchProducts();
    }, [selectedFoodtypeId]);

    const handleMenuClick = (e: any) => {
        setSelectedFoodtypeId(e.key);
    };

    return (
        <div style={{ padding: '2rem' }} >
            <Navigation></Navigation>

            <Layout style={{ minHeight: '100vh', background: '#fff' }}>
                <Sider width={250} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
                    <Title level={4} style={{ padding: '16px 24px' }}>Danh mục</Title>
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
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={{ padding: 24, margin: 0, minHeight: 280, background: '#fff' }}>
                        {isLoadingProducts ? <Spin size="large" style={{ display: 'block', marginTop: '50px' }} /> : (
                            <Row gutter={[16, 16]}>
                                {products.length > 0 ? products.map(food => (
                                    <Col key={food._id} xs={24} sm={12} md={8} lg={6}>
                                        <FoodCard food={food} />
                                    </Col>
                                )) : <p>Không có sản phẩm nào trong danh mục này.</p>}
                            </Row>
                        )}
                    </Content>
                </Layout>

                <FloatButton
                    icon={<ShoppingCartOutlined />}
                    type="primary"
                    badge={{ count: totalItems, color: 'red' }} // Hiển thị số lượng động
                    tooltip="Xem giỏ hàng"
                    onClick={() => setCartOpen(true)} // Mở giỏ hàng khi click
                />

                <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            </Layout>

            <Footerapp />
        </div>
    );
};

export default MenuPage;