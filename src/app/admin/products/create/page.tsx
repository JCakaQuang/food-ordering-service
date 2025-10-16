"use client";

import React, { useState } from 'react';
import axios from 'axios';
import ProductForm from '../_components/form';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

const CreateProductPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async (values: any) => {
        setIsSubmitting(true);
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/foods`;

            await axios.post(apiUrl, values);

            message.success("Tạo sản phẩm thành công!");
            router.push('/admin/products');
        } catch (error: any) {
            console.error("Lỗi khi tạo sản phẩm:", error);
            const errorMessage = error.response?.data?.message || "Tạo sản phẩm thất bại.";
            message.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Tạo sản phẩm mới</h1>
            <ProductForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
        </div>
    );
};

export default CreateProductPage;