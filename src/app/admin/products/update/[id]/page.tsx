"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from '../../_components/form';
import { message } from 'antd';
import { useRouter, useParams } from 'next/navigation';
interface Product {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
    foodtype: string;
}

const UpdateProductPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [initialData, setInitialData] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchInitialData = async () => {
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/foods/${id}`;
                // Chỉ định kiểu dữ liệu trả về cho axios
                const response = await axios.get<Product>(apiUrl);
                setInitialData(response.data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
                message.error("Không thể tải dữ liệu sản phẩm.");
            }
        };

        fetchInitialData();
    }, [id]);

    const handleUpdate = async (values: any) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...values,
                price: Number(values.price),
                quantity: Number(values.quantity),
            };

            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/foods/${id}`;
            await axios.patch(apiUrl, payload);

            message.success("Cập nhật sản phẩm thành công!");
            router.push('/admin/products');

        } catch (error: any) {
            console.error('Lỗi khi cập nhật sản phẩm:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || "Cập nhật sản phẩm thất bại.";
            message.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!initialData) return <p>Đang tải dữ liệu...</p>;

    return (
        <div>
            <h1>Cập nhật sản phẩm</h1>
            <ProductForm
                initialData={initialData}
                onSubmit={handleUpdate}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default UpdateProductPage;