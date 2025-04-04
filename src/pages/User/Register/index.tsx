import { register } from '@/services/ant-design-pro';
import { ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, Form } from 'antd';
import React from 'react';
type Props = {
  setCurrentStatus: (status: 'login' | 'register') => void;
};
export const RegisterForm: React.FC<Props> = (props) => {
  const { setCurrentStatus } = props;
  const [form] = Form.useForm<API.RegisterDto>();
  const { run } = useRequest(register, {
    manual: true,
    onSuccess: () => {
      setCurrentStatus('login');
    },
  });
  const handleRegister = async () => {
    form.validateFields().then(async (values) => {
      const { email, password, confirmPassword, role } = values;
      if (password !== confirmPassword) {
        form.setFields([
          {
            name: 'confirmPassword',
            errors: ['两次输入密码不一致'],
          },
        ]);
        return;
      }
      await run({ email, password, role });
    });
  };
  return (
    <Form<API.RegisterDto>
      form={form}
      style={{
        marginTop: 20,
        minWidth: 500,
        padding: '40px 40px 24px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 21, 41, 0.12)',
        maxWidth: '75vw',
        height: '400px',
        backgroundColor: 'white',
      }}
    >
      <ProFormText
        label="邮箱"
        name={'email'}
        rules={[
          { required: true, message: '请输入邮箱' },
          {
            type: 'email',
            message: '请输入正确的邮箱格式',
          },
        ]}
      />
      <ProFormText.Password
        label="密码"
        name={'password'}
        rules={[{ required: true, message: '请输入密码' }]}
      />
      <ProFormText.Password
        label="确认密码"
        name={'confirmPassword'}
        rules={[{ required: true, message: '请输入确认密码' }]}
      />
      <ProFormRadio.Group
        name="role"
        label="角色"
        radioType="button"
        options={[
          {
            label: '医生',
            value: 'doctor',
          },
          {
            label: '患者',
            value: 'patient',
          },
        ]}
      />
      <Button
        type="primary"
        size="large"
        style={{ width: '100%', marginBottom: 20 }}
        onClick={handleRegister}
      >
        注册
      </Button>
      <div>
        <span>已拥有账号？</span>
        <Button type="link" onClick={() => setCurrentStatus('login')}>
          登录
        </Button>
      </div>
    </Form>
  );
};
