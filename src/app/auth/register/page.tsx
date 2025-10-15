'use client';

import React from 'react';
import { Button, Form, Input, Card, Typography, message } from 'antd';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    // --- SỬA LỖI Ở ĐÂY ---
    // Loại bỏ trường `confirm` trước khi gửi lên API
    const { confirm, ...registerData } = values;

    try {
      // Gửi đi dữ liệu đã được làm sạch
      await register(registerData); 
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Registration failed:', error);
      message.error(error.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: 'center' }}>Đăng Ký</Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
           <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;