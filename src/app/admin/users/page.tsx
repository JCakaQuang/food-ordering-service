"use client";

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const UserListPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/v1/users');
            const result = await response.json();
            setUsers(result.data);
        } catch (error) {
            message.error("Không thể tải danh sách người dùng.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/users/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Xóa thất bại.");
            message.success("Xóa người dùng thành công!");
            fetchData();
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const columns = [
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Vai trò', dataIndex: 'role', key: 'role', render: (role: string) => <Tag color={role === 'admin' ? 'red' : 'blue'}>{role.toUpperCase()}</Tag> },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: User) => (
                <Space size="middle">
                    <Link href={`/admin/users/update/${record._id}`}>
                        <Button icon={<EditOutlined />} type="primary">Sửa</Button>
                    </Link>
                    <Popconfirm title="Bạn có chắc muốn xóa người dùng này?" onConfirm={() => handleDelete(record._id)}>
                        <Button icon={<DeleteOutlined />} danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h1>Quản lý Người dùng</h1>
                <Link href="/admin/users/create">
                    <Button type="primary" icon={<PlusOutlined />}>Thêm người dùng</Button>
                </Link>
            </div>
            <Table columns={columns} dataSource={users} rowKey="_id" loading={isLoading} />
        </div>
    );
};

export default UserListPage;