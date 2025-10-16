"use client";

import React, { useState } from 'react';
import axios from 'axios'; // 1. Import axios
import FoodtypeForm from '../_components/form';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

const CreateFoodtypePage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async (values: any) => {
        setIsSubmitting(true);
        try {
            // 2. Sử dụng biến môi trường và axios.post
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/foodtype`;

            // axios tự động chuyển object 'values' thành JSON và đặt header 'Content-Type'
            await axios.post(apiUrl, values);

            message.success("Tạo mới thành công!");
            router.push('/admin/foodtype'); // Chuyển về trang danh sách
        } catch (error: any) {
            // 3. Xử lý lỗi từ axios
            console.error("Lỗi khi tạo loại món ăn:", error);
            // Lấy thông báo lỗi từ response của API nếu có, nếu không thì dùng thông báo mặc định
            const errorMessage = error.response?.data?.message || "Tạo mới thất bại. Vui lòng thử lại.";
            message.error(errorMessage);
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