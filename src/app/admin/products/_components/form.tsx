"use client";

import React, { useEffect, useState } from 'react';
import { Form, Input, Button, InputNumber, Select, message } from 'antd';

interface ProductFormProps {
    initialData?: any;
    onSubmit: (values: any) => void;
    isSubmitting: boolean;
}

interface FoodType {
    _id: string;
    name: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
    const [form] = Form.useForm();
    const [foodtypes, setFoodtypes] = useState<FoodType[]>([]);

    useEffect(() => {
        // Lấy danh sách loại món ăn để hiển thị trong dropdown
        const fetchFoodtypes = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/foodtype');
                const result = await response.json();
                setFoodtypes(result.data);
            } catch (error) {
                message.error("Không thể tải danh sách loại món ăn.");
            }
        };
        fetchFoodtypes();

        if (initialData) {
            form.setFieldsValue(initialData);
        }
    }, [initialData, form]);

    return (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Form.Item name="name" label="Tên món ăn" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="price" label="Giá tiền" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
                <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item name="quantity" label="Số lượng trong kho" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
                <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item name="foodtype_id" label="Loại món ăn" rules={[{ required: true, message: 'Vui lòng chọn loại!' }]}>
                <Select placeholder="Chọn loại món ăn">
                    {foodtypes.map(ft => <Select.Option key={ft._id} value={ft._id}>{ft.name}</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="image" label="URL Hình ảnh">
                <Input placeholder="https://res.cloudinary.com/.../image.jpg" />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
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

export default ProductForm;