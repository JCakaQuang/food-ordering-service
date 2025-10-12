"use client";

import React, { useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';

interface UserFormProps {
    initialData?: any;
    onSubmit: (values: any) => void;
    isSubmitting: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue(initialData);
        }
    }, [initialData, form]);

    return (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Form.Item name="name" label="Tên người dùng" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
                <Input />
            </Form.Item>
            <Form.Item 
                name="password" 
                label="Mật khẩu"
                // Mật khẩu chỉ bắt buộc khi tạo mới
                rules={[{ required: !initialData, message: 'Vui lòng nhập mật khẩu!' }]}
                help={initialData ? "Để trống nếu không muốn thay đổi mật khẩu." : ""}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
                <Select placeholder="Chọn vai trò">
                    <Select.Option value="user">User</Select.Option>
                    <Select.Option value="admin">Admin</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                    {initialData ? 'Cập nhật' : 'Tạo mới'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UserForm;