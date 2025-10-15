'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'user';
}

interface ApiResponse {
    data: User[];
    meta: {
        current: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

const UserManagementPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [form] = Form.useForm();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get<ApiResponse>(`${API_URL}/users`);
            setUsers(response.data.data);
        } catch (error) {
            message.error('Lỗi khi tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const showModal = (user: any = null) => {
        setEditingUser(user);
        form.setFieldsValue(user || { name: '', email: '', phone: '', role: 'user' });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingUser(null);
        form.resetFields();
    };

    const onFinish = async (values: any) => {
        try {
            if (editingUser) {
                // Update user
                await axios.patch(`${API_URL}/users/${editingUser._id}`, values);
                message.success('Cập nhật người dùng thành công!');
            } else {
                // Create user
                await axios.post(`${API_URL}/users`, values);
                message.success('Thêm người dùng thành công!');
            }
            handleCancel();
            fetchUsers();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Thao tác thất bại');
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            await axios.delete(`${API_URL}/users/${userId}`);
            message.success('Xóa người dùng thành công!');
            fetchUsers();
        } catch (error) {
            message.error('Xóa người dùng thất bại');
        }
    };

    const columns = [
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Điện thoại', dataIndex: 'phone', key: 'phone' },
        { title: 'Vai trò', dataIndex: 'role', key: 'role' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
                style={{ marginBottom: 16 }}
            >
                Thêm người dùng
            </Button>
            <Table columns={columns} dataSource={users} rowKey="_id" loading={loading} />

            <Modal
                title={editingUser ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okText={editingUser ? 'Lưu' : 'Tạo'}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    {!editingUser && ( // Chỉ hiển thị trường password khi tạo mới
                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6 }]}>
                            <Input.Password />
                        </Form.Item>
                    )}
                    <Form.Item name="phone" label="Điện thoại" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="user">User</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagementPage;