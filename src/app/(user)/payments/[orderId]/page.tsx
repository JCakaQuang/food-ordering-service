"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Card,
    Typography,
    Spin,
    Result,
    List,
    Avatar,
    Divider,
    Button,
    Tag,
    message,
    Modal,
    Col,
    Row
} from 'antd';
import { ShoppingCartOutlined, CreditCardOutlined } from '@ant-design/icons';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';

const { Title, Text, Paragraph } = Typography;

interface FoodItem {
    _id: string;
    name: string;
    image: string;
}

interface OrderItem {
    _id: string;
    food_id: FoodItem;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    status: 'pending' | 'paid' | string;
    total_price: number;
    items: OrderItem[];
}

interface OrderItemFromApi {
    _id: string;
    food_id: string;
    quantity: number;
    price: number;
}

interface DetailsApiResponse {
    data: OrderItemFromApi[];
}

type OrderApiResponse = Omit<Order, 'items'>;


const ORDER_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';
const FOOD_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/api/v1';


const PaymentPageContent: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError("Không tìm thấy mã đơn hàng.");
            setIsLoading(false);
            return;
        }

        const fetchOrderData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [orderRes, detailsRes] = await Promise.all([
                    axios.get<OrderApiResponse>(`${ORDER_API_URL}/order/${orderId}`),
                    axios.get<DetailsApiResponse>(`${ORDER_API_URL}/oder-detail?order_id=${orderId}`)
                ]);
                const orderDetailsFromApi = detailsRes.data.data;

                const foodDetailPromises = orderDetailsFromApi.map(detail =>
                    axios.get<FoodItem>(`${FOOD_API_URL}/foods/${detail.food_id}`)
                );
                const foodDetailResponses = await Promise.all(foodDetailPromises);

                const itemsWithFoodDetails: OrderItem[] = orderDetailsFromApi.map((detail, index) => ({
                    ...detail,
                    food_id: foodDetailResponses[index].data,
                }));

                const combinedOrder: Order = {
                    ...orderRes.data,
                    items: itemsWithFoodDetails,
                };
                setOrder(combinedOrder);

            } catch (err) {
                console.error("Lỗi khi tải chi tiết đơn hàng:", err);
                setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderData();
    }, [orderId]);

    const handleConfirmPayment = async () => {
        if (!orderId || order?.status === 'paid') return;

        setIsConfirming(true);
        setError(null);

        try {
            await axios.patch(`${ORDER_API_URL}/order/${orderId}/confirm-payment`);
            message.success('Thanh toán thành công!');

            if(order) {
                setOrder({ ...order, status: 'paid' });
            }
            setShowSuccessModal(true);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Xác nhận thanh toán thất bại.');
            console.error('Lỗi khi xác nhận thanh toán:', err);
        } finally {
            setIsConfirming(false);
        }
    };

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Result status="error" title="Đã có lỗi xảy ra" subTitle={error} />;
    }

    if (!order) {
        return <Result status="warning" title="Không tìm thấy thông tin đơn hàng." />;
    }
    
    return (
        <div style={{ background: '#f0f2f5', padding: '24px 0', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Card style={{ width: '100%', maxWidth: '800px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <Row gutter={[24, 24]} align="middle" style={{marginBottom: 24}}>
                    <Col xs={24} sm={12} style={{ textAlign: 'center' }}>
                         <ShoppingCartOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
                        <Title level={2} style={{marginTop: 8}}>Xác nhận Đơn hàng</Title>
                    </Col>
                     <Col xs={24} sm={12}>
                        <Tag color={order.status === 'paid' ? "green" : "blue"} style={{fontSize: 14, padding: '5px 10px', marginBottom: 16}}>
                            Trạng thái: {order.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                        </Tag>
                        <Paragraph>Mã đơn hàng: <Text copyable strong>{order._id}</Text></Paragraph>
                        <Paragraph>Vui lòng kiểm tra lại các món ăn và tổng tiền trước khi xác nhận.</Paragraph>
                    </Col>
                </Row>
                
                <Divider />

                <Title level={4}>Chi tiết món ăn</Title>
                <List
                    itemLayout="horizontal"
                    dataSource={order.items}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar shape="square" size={64} src={item.food_id?.image || '/placeholder.png'} />}
                                title={<Text strong>{item.food_id?.name || 'Món ăn không xác định'}</Text>}
                                description={`Số lượng: ${item.quantity} x ${item.price.toLocaleString('vi-VN')} VNĐ`}
                            />
                            <Text strong>{(item.quantity * item.price).toLocaleString('vi-VN')} VNĐ</Text>
                        </List.Item>
                    )}
                />

                <Divider />

                <div style={{ textAlign: 'right' }}>
                    <Title level={3}>Tổng cộng: <span style={{color: '#fa8c16'}}>{order.total_price.toLocaleString('vi-VN')} VNĐ</span></Title>
                </div>
                
                <Divider />

                {order.status === 'paid' ? (
                     <Result
                        status="success"
                        title="Đơn hàng đã được thanh toán thành công!"
                        extra={[
                            <Button type="primary" key="history" onClick={() => router.push('/orders/order-history')}>
                                Xem lịch sử đơn hàng
                            </Button>,
                        ]}
                    />
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                         <Paragraph>Phương thức: <Text strong>Thanh toán khi nhận hàng (COD)</Text></Paragraph>
                        <Button
                            type="primary"
                            size="large"
                            icon={<CreditCardOutlined />}
                            onClick={handleConfirmPayment}
                            loading={isConfirming}
                            disabled={isConfirming}
                        >
                            Xác nhận Thanh toán
                        </Button>
                    </div>
                )}
            </Card>

            <Modal
                title="Thanh toán thành công!"
                open={showSuccessModal}
                closable={false}
                footer={[
                    <Button key="history" type="primary" onClick={() => router.push('/orders/order-history')}>
                        Xem lịch sử đơn hàng
                    </Button>,
                    <Button key="home" onClick={() => router.push('/')}>
                        Trở về trang chủ
                    </Button>,
                ]}
            >
                <Result
                    status="success"
                    title="Đơn hàng của bạn đã được xác nhận!"
                    subTitle={`Mã đơn hàng: ${orderId}. Cảm ơn bạn đã mua hàng!`}
                />
            </Modal>
        </div>
    );
};

const PaymentPage = () => (
    <ProtectedRoute>
        <PaymentPageContent />
    </ProtectedRoute>
);


export default PaymentPage;