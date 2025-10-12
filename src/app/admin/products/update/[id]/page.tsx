"use client";

import React, { useState, useEffect } from 'react';
import ProductForm from '../../_components/form';
import { message } from 'antd';
import { useRouter, useParams } from 'next/navigation';

const UpdateProductPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [initialData, setInitialData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchInitialData = async () => {
            try {
                // Giả sử API findOne của food trả về object food trực tiếp
                const response = await fetch(`http://localhost:8080/api/v1/foods/${id}`);
                const result = await response.json();
                setInitialData(result);
            } catch (error) {
                message.error("Không thể tải dữ liệu sản phẩm.");
            }
        };
        fetchInitialData();
    }, [id]);

    const handleUpdate = async (values: any) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/api/v1/foods/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error("Cập nhật sản phẩm thất bại.");
            message.success("Cập nhật sản phẩm thành công!");
            router.push('/admin/products');
        } catch (error: any) {
            message.error(error.message);
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