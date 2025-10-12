"use client";

import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';

interface FoodtypeFormProps {
    initialData?: any; // Dữ liệu ban đầu để điền vào form khi "Sửa"
    onSubmit: (values: any) => void;
    isSubmitting: boolean;
}

const FoodtypeForm: React.FC<FoodtypeFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
    const [form] = Form.useForm();

    // Điền dữ liệu vào form nếu đây là trang "Sửa"
    useEffect(() => {
        if (initialData) {
            form.setFieldsValue(initialData);
        }
    }, [initialData, form]);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
        >
            <Form.Item
                name="name"
                label="Tên loại món ăn"
                rules={[{ required: true, message: 'Vui lòng nhập tên loại!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="description"
                label="Mô tả"
            >
                <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                    {initialData ? 'Cập nhật' : 'Tạo mới'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default FoodtypeForm;