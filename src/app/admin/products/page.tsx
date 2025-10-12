"use client";

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Image, App, TableProps, TablePaginationConfig } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
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

    const fetchData = async (paginationParams: TablePaginationConfig = {}) => {
        setIsLoading(true);
        const { current = 1, pageSize = 10 } = paginationParams;
        try {
            const response = await fetch(`http://localhost:8080/api/v1/foods?current=${current}&pageSize=${pageSize}`);
            const result = await response.json();
            setProducts(result.data);

            setPagination(prev => ({
                ...prev,
                current: result.meta.current,
                pageSize: result.meta.pageSize,
                total: result.meta.total,
            }));
        } catch (error: any) {
            message.error(error.message || "Không thể tải danh sách sản phẩm.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/foods/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error("Xóa thất bại.");
            message.success("Xóa sản phẩm thành công!");
            fetchData();
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleTableChange: TableProps<Product>['onChange'] = (newPagination) => {
        fetchData({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
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
                onChange={handleTableChange}/>
        </div>
    );
};

export default ProductListPage;