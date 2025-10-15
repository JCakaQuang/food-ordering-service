'use client';

import React from 'react';
import { Button, Form, Input, Card, Typography, message } from 'antd';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      await login(values);
      message.success('Đăng nhập thành công!');
    } catch (error: any) {
      console.error('Login failed:', error);
      message.error(error.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: 'center' }}>Đăng Nhập</Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;