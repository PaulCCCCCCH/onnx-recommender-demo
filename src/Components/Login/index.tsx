import React from "react";
import { Form, Input, Button } from 'antd';

type Props = {
  onLogin: (arg: string) => void;
};

type FormValues = {
  username: string,
  password: string
} 

export default function Login({ onLogin }: Props) {

  const [form] = Form.useForm();

  const onFinish = (values: FormValues) => {
    onLogin(values.username)
    form.resetFields()
  };

  return (
    <>
    <Form
      name="login-form"
      form={form}
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Log in
        </Button>
      </Form.Item>
    </Form>
    </>

  );
}