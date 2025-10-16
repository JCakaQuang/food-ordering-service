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
    App
} from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
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

interface DetailsApiResponse {
    data: OrderItem[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';


const OrderDetailsPageContent: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;
    const { message } = App.useApp();

    const [details, setDetails] = useState<OrderItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError("Không tìm thấy mã đơn hàng.");
            setIsLoading(false);
            return;
        }

        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get<DetailsApiResponse>(`${API_URL}/oder-detail?order_id=${orderId}`);

                const populatedDetails = response.data.data;

                if (!populatedDetails || populatedDetails.length === 0) {
                    setDetails([]);
                } else {
                    setDetails(populatedDetails);
                }

            } catch (err) {
                console.error("Lỗi khi tải chi tiết đơn hàng:", err);
                message.error("Không thể tải thông tin chi tiết đơn hàng.");
                setError("Có lỗi xảy ra, vui lòng thử lại.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [orderId, message]);

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Spin size="large" tip="Đang tải chi tiết..."/></div>;
    }

    if (error) {
        return <Result status="error" title="Đã có lỗi xảy ra" subTitle={error} />;
    }

    return (
        <div style={{ background: '#f0f2f5', padding: '24px', minHeight: '80vh' }}>
            <Card>
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => router.back()}
                    style={{ marginBottom: 16 }}
                >
                    Quay lại
                </Button>
                <Title level={2}><ShoppingCartOutlined /> Chi tiết Đơn hàng</Title>
                <Paragraph>Mã đơn hàng: <Text copyable strong>{orderId}</Text></Paragraph>
                
                <Divider />

                <List
                    itemLayout="horizontal"
                    dataSource={details}
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
            </Card>
        </div>
    );
};

const OrderDetailsPage = () => (
    <ProtectedRoute>
        <OrderDetailsPageContent />
    </ProtectedRoute>
);

export default OrderDetailsPage;