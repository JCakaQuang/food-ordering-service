"use client";

import React, { useState, useEffect } from 'react';
import FoodtypeForm from '../../_components/form';
import { message } from 'antd';
import { useRouter, useParams } from 'next/navigation';

const UpdateFoodtypePage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const [initialData, setInitialData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        // Lấy dữ liệu cũ của đối tượng để điền vào form
        const fetchInitialData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/foodtype/${id}`);
                const result = await response.json();
                setInitialData(result);
            } catch (error) {
                message.error("Không thể tải dữ liệu.");
            }
        };
        fetchInitialData();
    }, [id]);

    const handleUpdate = async (values: any) => {
        console.log('Attempting to update with values:', values);
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/api/v1/foodtype/${id}`, {
                method: 'PATCH', // Hoặc PUT
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error("Cập nhật thất bại.");
            message.success("Cập nhật thành công!");
            router.push('/admin/foodtype');
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!initialData) {
        return <p>Đang tải dữ liệu...</p>;
    }

    return (
        <div>
            <h1>Cập nhật Loại món ăn</h1>
            <FoodtypeForm 
                initialData={initialData}
                onSubmit={handleUpdate}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default UpdateFoodtypePage;