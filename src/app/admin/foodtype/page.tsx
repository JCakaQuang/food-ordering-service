"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Import axios
import { Table, Button, Space, message, Popconfirm, TablePaginationConfig, TableProps } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface FoodType {
    _id: string;
    name: string;
    description: string;
}

const FoodtypeListPage = () => {
    const [foodtypes, setFoodtypes] = useState<FoodType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchData = async (paginationParams: TablePaginationConfig = pagination) => {
        setIsLoading(true);
        const { current = 1, pageSize = 10 } = paginationParams;

        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/foodtype`;
            // axios cho phép truyền params một cách rõ ràng
            const response = await axios.get(apiUrl, {
                params: { current, pageSize }
            });

            interface ApiResponse {
                data: FoodType[];
                meta: {
                    current: number;
                    pageSize: number;
                    total: number;
                };
            }

            const result = response.data as ApiResponse;

            setFoodtypes(result.data);
            setPagination({
                current: result.meta.current,
                pageSize: result.meta.pageSize,
                total: result.meta.total,
            });
        } catch (error) {
            console.error("Lỗi khi tải danh sách:", error);
            message.error("Không thể tải danh sách loại món ăn.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 3. Cập nhật hàm handleDelete để dùng axios
    const handleDelete = async (id: string) => {
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/foodtype/${id}`;
            await axios.delete(apiUrl); // Sử dụng axios.delete

            message.success("Xóa thành công!");
            // Tải lại dữ liệu ở trang hiện tại sau khi xóa
            fetchData(pagination);
        } catch (error: any) {
            console.error("Lỗi khi xóa:", error);
            const errorMessage = error.response?.data?.message || "Xóa thất bại.";
            message.error(errorMessage);
        }
    };

    const handleTableChange: TableProps<FoodType>['onChange'] = (newPagination) => {
        fetchData(newPagination);
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