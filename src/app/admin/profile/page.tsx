'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Input, Button, Typography, App } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, LockOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';

const { Title } = Typography;
const USER_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const ProfilePageContent = () => {
  const { user, updateUser } = useAuth(); // Lấy user và hàm updateUser từ context
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { message } = App.useApp(); // Dùng hook của Antd để hiển thị thông báo

  // State loading riêng cho từng hành động
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Tự động điền dữ liệu vào form khi thông tin user thay đổi
  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  // Xử lý cập nhật thông tin cá nhân
  const handleUpdateProfile = async (values: any) => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await axios.patch(`${USER_API_URL}/users/${user._id}`, values);
      
      updateUser(values); 
      
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      message.error('Cập nhật thất bại, vui lòng thử lại.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    if (!user) return;
    setIsChangingPassword(true);
    try {
      await axios.patch(`${USER_API_URL}/users/password/change`, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      message.success('Đổi mật khẩu thành công!');
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card>
            <Title level={4}>Thông tin cá nhân</Title>
            <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
              <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} size="large" />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input prefix={<MailOutlined />} size="large" disabled />
              </Form.Item>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                <Input prefix={<PhoneOutlined />} size="large" />
              </Form.Item>
              <Form.Item name="address" label="Địa chỉ">
                <Input prefix={<HomeOutlined />} size="large" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isUpdating} size="large">
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card>
            <Title level={4}>Đổi mật khẩu</Title>
            <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
                <Form.Item name="currentPassword" label="Mật khẩu hiện tại" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}>
                    <Input.Password prefix={<LockOutlined />} size="large" />
                </Form.Item>
                <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, min: 6, message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' }]} hasFeedback>
                    <Input.Password prefix={<LockOutlined />} size="large" />
                </Form.Item>
                <Form.Item name="confirmPassword" label="Xác nhận mật khẩu mới" dependencies={['newPassword']} hasFeedback rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('newPassword') === value) { return Promise.resolve(); } return Promise.reject(new Error('Mật khẩu xác nhận không khớp!')); }, }),]}>
                    <Input.Password prefix={<LockOutlined />} size="large" />
                </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isChangingPassword} size="large">
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const ProfilePage = () => (
  <ProtectedRoute>
    <ProfilePageContent />
  </ProtectedRoute>
);

export default ProfilePage;
