import { useTokenLocalStorage } from '@/hooks/useTokenLocalStorage';
import { login, queryCode } from '@/services/ant-design-pro';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useModel, useRequest } from '@umijs/max';
import { Button, Form, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { RegisterForm } from '../Register/index';
import styles from './style.less';

const Login: React.FC = () => {
  const [type, setType] = useState<string>('password');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm<API.LoginDto>();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  // login or register
  const [currentStatus, setCurrentStatus] = useState<'login' | 'register'>('login');
  const intl = useIntl();
  const { set } = useTokenLocalStorage();

  // 登录
  const { run: LoginRun } = useRequest(login, {
    manual: true,
    onSuccess: async (res) => {
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      message.success('登录成功！');
      await set(res.access_token);
      await fetchUserInfo();
    },
  });

  // 发送验证码
  const { run: sendCodeRun } = useRequest(queryCode, {
    manual: true,
    onSuccess: () => {
      message.success('获取验证码成功！请注意查收');
    },
  });
  const handleSubmit = async (values: API.LoginDto) => {
    await LoginRun(values);
  };

  return (
    <div className={styles.container}>
      {currentStatus === 'login' ? (
        <LoginForm
          form={form}
          contentStyle={{
            marginTop: 20,
            padding: '40px 40px 24px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 21, 41, 0.12)',
            backgroundColor: 'white',
          }}
          title="智慧微诊所系统"
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
          actions={[
            <span key={'xxx'}>没有注册过账号？</span>,
            <Button type="link" key={'register'} onClick={() => setCurrentStatus('register')}>
              注册
            </Button>,
          ]}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'password',
                label: '密码登录',
              },
              {
                key: 'code',
                label: '验证码登录',
              },
            ]}
          />
          {type === 'password' && (
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入'}
                rules={[
                  {
                    required: true,
                    message: '请输入邮箱号！',
                  },
                  {
                    type: 'email',
                    message: '请输入正确的邮箱格式',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
          )}

          {type === 'code' && (
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入'}
                rules={[
                  {
                    required: true,
                    message: '请输入邮箱号！',
                  },
                  {
                    type: 'email',
                    message: '请输入正确的邮箱格式',
                  },
                ]}
              />
              <ProFormCaptcha
                name="code"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入'}
                captchaProps={{
                  size: 'large',
                }}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async () => {
                  const email = form.getFieldValue('email');
                  sendCodeRun({ email });
                }}
              />
            </>
          )}
        </LoginForm>
      ) : (
        <RegisterForm setCurrentStatus={setCurrentStatus} />
      )}
    </div>
  );
};

export default Login;
