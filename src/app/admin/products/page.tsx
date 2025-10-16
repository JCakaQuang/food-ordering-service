"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Space, Popconfirm, Image, App, TableProps, TablePaginationConfig } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';

// 1. Giữ nguyên interface Product
interface Product {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

// 2. Định nghĩa interface cho toàn bộ cấu trúc API response
interface ApiResponse {
    data: Product[];
    meta: {
        current: number;
        pageSize: number;
        total: number;
    };
}

const ProductListPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { message } = App.useApp();

    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchData = async (paginationParams: TablePaginationConfig = pagination) => {
        setIsLoading(true);
        const { current = 1, pageSize = 10 } = paginationParams;
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/foods`;
            
            // 3. Áp dụng kiểu ApiResponse cho axios.get
            const response = await axios.get<ApiResponse>(apiUrl, {
                params: { current, pageSize }
            });

            // Bây giờ TypeScript đã biết 'result' có cấu trúc ApiResponse
            const result = response.data; 

            setProducts(result.data);
            setPagination(prev => ({
                ...prev,
                current: result.meta.current,
                pageSize: result.meta.pageSize,
                total: result.meta.total,
            }));
        } catch (error: any) {
            console.error("Lỗi khi tải danh sách sản phẩm:", error);
            message.error("Không thể tải danh sách sản phẩm.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/foods/${id}`;
            await axios.delete(apiUrl);

            message.success("Xóa sản phẩm thành công!");
            fetchData(pagination);
        } catch (error: any) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            const errorMessage = error.response?.data?.message || "Xóa thất bại.";
            message.error(errorMessage);
        }
    };

    const handleTableChange: TableProps<Product>['onChange'] = (newPagination) => {
        fetchData(newPagination);
    };

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (url: string) => <Image src={url} width={60} height={60} alt="food" style={{ objectFit: 'cover' }} />
        },
        { title: 'Tên món ăn', dataIndex: 'name', key: 'name' },
        { title: 'Giá', dataIndex: 'price', key: 'price', render: (price: number) => `${price.toLocaleString('vi-VN')} đ` },
        { title: 'Số lượng kho', dataIndex: 'quantity', key: 'quantity' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Product) => (
                <Space size="middle">
                    <Link href={`/admin/products/update/${record._id}`}>
                        <Button icon={<EditOutlined />} type="primary">Sửa</Button>
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa sản phẩm này?"
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
                <h1>Quản lý Sản phẩm</h1>
                <Link href="/admin/products/create">
                    <Button type="primary" icon={<PlusOutlined />}>Thêm sản phẩm</Button>
                </Link>
            </div>
            <Table columns={columns} dataSource={products} rowKey="_id" loading={isLoading}
                pagination={pagination}
                onChange={handleTableChange} />
        </div>
    );
};

export default ProductListPage;