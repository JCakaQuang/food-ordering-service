// File: /app/(admin)/foodtype/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, TablePaginationConfig, TableProps } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FoodType {
    _id: string;
    name: string;
    description: string;
}

const FoodtypeListPage = () => {
    const [foodtypes, setFoodtypes] = useState<FoodType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchData = async (paginationParams: TablePaginationConfig = {}) => {
        setIsLoading(true);
        const { current = 1, pageSize = 10 } = paginationParams;
        try {
            const response = await fetch(`http://localhost:8080/api/v1/foodtype?current=${current}&pageSize=${pageSize}`); // API lấy danh sách
            const result = await response.json();
            setFoodtypes(result.data);

            setPagination(prev => ({
                ...prev,
                current: result.meta.current,
                pageSize: result.meta.pageSize,
                total: result.meta.total,
            }));
        } catch (error) {
            message.error("Không thể tải danh sách.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/foodtype/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error("Xóa thất bại.");
            message.success("Xóa thành công!");
            fetchData(); // Tải lại dữ liệu sau khi xóa
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleTableChange: TableProps<FoodType>['onChange'] = (newPagination) => {
            fetchData({
                current: newPagination.current,
                pageSize: newPagination.pageSize,
            });
        };

    const columns = [
        { title: 'Tên loại', dataIndex: 'name', key: 'name' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: FoodType) => (
                <Space size="middle">
                    <Link href={`/admin/foodtype/update/${record._id}`}>
                        <Button icon={<EditOutlined />} type="primary">Sửa</Button>
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button icon={<DeleteOutlined />} danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h1>Quản lý Loại món ăn</h1>
                <Link href="/admin/foodtype/create">
                    <Button type="primary" icon={<PlusOutlined />}>Thêm mới</Button>
                </Link>
            </div>
            <Table
                columns={columns}
                dataSource={foodtypes}
                rowKey="_id"
                loading={isLoading}
                pagination={pagination}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default FoodtypeListPage;