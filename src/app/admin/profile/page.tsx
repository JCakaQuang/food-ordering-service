'use client';

import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Typography,
  Spin,
  message,
  Descriptions,
} from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, LockOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/app/context/AuthContext';

const { Title } = Typography;

// Định nghĩa kiểu dữ liệu cho thông tin user
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const ProfilePageContent = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const { Title } = Typography;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

  // Hàm lấy thông tin user từ localStorage
  const getStoredUser = () => {
    const storedUser = localStorage.getItem('user_info');
    return storedUser ? JSON.parse(storedUser) : null;
  };
  
  React.useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  // Xử lý cập nhật thông tin cá nhân
  const handleUpdateProfile = async (values: any) => {
    if (!user) return;
    try {
      // axios đã được cấu hình với token trong AuthContext
      const response = await axios.patch(`${API_URL}/users/${user._id}`, values);
      
      const updatedUser = { ...(user || {}), ...(response.data || {}) };

      message.success('Cập nhật thông tin thành công!');
      

    } catch (error) {
      message.error('Cập nhật thất bại, vui lòng thử lại.');
    }
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (values: any) => {
    try {
      await axios.patch(`${API_URL}/users/password/change`, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      message.success('Đổi mật khẩu thành công!');
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        {/* Cột thông tin cá nhân */}
        <Col xs={24} lg={12}>
          <Card>
            <Title level={4}>Thông tin cá nhân</Title>
            <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
              <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input prefix={<MailOutlined />} disabled />
              </Form.Item>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
              <Form.Item name="address" label="Địa chỉ">
                <Input prefix={<HomeOutlined />} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập nhật thông tin
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Cột đổi mật khẩu */}
        <Col xs={24} lg={12}>
          <Card>
            <Title level={4}>Đổi mật khẩu</Title>
            <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
              <Form.Item
                name="currentPassword"
                label="Mật khẩu hiện tại"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[{ required: true, min: 6, message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' }]}
                hasFeedback
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
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


// Component cha bọc bởi ProtectedRoute
const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
};

export default ProfilePage;