'use client';

import React, { useState } from 'react';
import { Button, Form, Input, Card, Typography, message, Alert } from 'antd';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import Link from 'next/link';

const { Title } = Typography;

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onFinish = async (values: any) => {
        setLoading(true);
        setError(null);

        try {
            await login(values);
            message.success('Đăng nhập thành công!');
        } catch (err: unknown) { // Giữ kiểu 'unknown' để đảm bảo an toàn
            console.error('Login failed:', err);

            const errorObj = err as any; 

            if (errorObj && errorObj.response) {
                setError(errorObj.response.data.message || 'Email hoặc mật khẩu không chính xác.');
            } else if (errorObj && errorObj.request) {
                setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Một lỗi không xác định đã xảy ra.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Card style={{ width: 400, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
                    Đăng Nhập
                </Title>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Nhập email của bạn" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" size="large" />
                    </Form.Item>

                    {error && (
                        <Form.Item>
                            <Alert message={error} type="error" showIcon />
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        Chưa có tài khoản? <Link href="/auth/register">Đăng ký ngay!</Link>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;

