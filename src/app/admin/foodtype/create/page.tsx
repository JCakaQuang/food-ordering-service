"use client";

import React, { useState } from 'react';
import FoodtypeForm from '../_components/form';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

const CreateFoodtypePage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async (values: any) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8080/api/v1/foodtype', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error("Tạo mới thất bại.");
            message.success("Tạo mới thành công!");
            router.push('/admin/foodtype'); // Chuyển về trang danh sách
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Tạo Loại món ăn mới</h1>
            <FoodtypeForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
        </div>
    );
};

export default CreateFoodtypePage;