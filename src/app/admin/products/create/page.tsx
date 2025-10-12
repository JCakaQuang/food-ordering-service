"use client";

import React, { useState } from 'react';
import ProductForm from '../_components/form';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

const CreateProductPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async (values: any) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8080/api/v1/foods', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error("Tạo sản phẩm thất bại.");
            message.success("Tạo sản phẩm thành công!");
            router.push('/admin/products');
        } catch (error: any) {
            message.error(error.message);
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