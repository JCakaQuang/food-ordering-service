"use client";

import React, { useState } from 'react';
import UserForm from '../_components/form';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

const CreateUserPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async (values: any) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8080/api/v1/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error("Tạo người dùng thất bại.");
            message.success("Tạo người dùng thành công!");
            router.push('/admin/users');
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Tạo người dùng mới</h1>
            <UserForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
        </div>
    );
};

export default CreateUserPage;