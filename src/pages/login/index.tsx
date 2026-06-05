import { login } from '@/services/login/LoginController';
import { getToken, isTokenExpired, setToken } from '@/utils/auth';
import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

type LoginForm = {
  username: string;
  password: string;
  remember?: boolean;
};

const LoginPage: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { setInitialState } = useModel('@@initialState');

  useEffect(() => {
    if (getToken() && !isTokenExpired()) {
      history.replace('/');
    }
  }, []);

  const handleSubmit = async (values: LoginForm) => {
    setSubmitting(true);
    try {
      const res = await login({
        username: values.username,
        password: values.password,
      });
      const token = typeof res.data === 'string' ? res.data : '';
      if (!token) {
        message.error(res.msg || '登录失败');
        return;
      }
      setToken(token);
      message.success('登录成功');
      await setInitialState?.((state: any) => ({ ...state }));
      history.replace('/');
    } catch (error: any) {
      message.error(error?.response?.data?.msg || '登录失败，请检查账号和密码');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginShell}>
        <section className={styles.brandPanel}>
          <div>
            <h1 className={styles.brandTitle}>综合管理后台</h1>
            <div className={styles.brandMeta}>
              RBAC 权限控制、活动运营、赛程竞猜与奖品发放统一管理。
            </div>
          </div>
          <ul className={styles.statusList}>
            <li className={styles.statusItem}>
              <span>鉴权方式</span>
              <span className={styles.statusValue}>JWT</span>
            </li>
            <li className={styles.statusItem}>
              <span>菜单来源</span>
              <span className={styles.statusValue}>RBAC</span>
            </li>
            <li className={styles.statusItem}>
              <span>接口前缀</span>
              <span className={styles.statusValue}>/api</span>
            </li>
          </ul>
        </section>
        <main className={styles.formPanel}>
          <div className={styles.formBox}>
            <h2 className={styles.formTitle}>登录</h2>
            <p className={styles.formSubTitle}>使用后台账号进入管理系统</p>
            <ProForm<LoginForm>
              submitter={{
                render: () => (
                  <Button
                    className={styles.submitButton}
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    icon={<LoginOutlined />}
                    size="large"
                  >
                    登录
                  </Button>
                ),
              }}
              onFinish={handleSubmit}
            >
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                  autoComplete: 'username',
                }}
                placeholder="用户名或手机号"
                rules={[{ required: true, message: '请输入用户名或手机号' }]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                  autoComplete: 'current-password',
                }}
                placeholder="密码"
                rules={[{ required: true, message: '请输入密码' }]}
              />
              <ProFormCheckbox name="remember">保持登录</ProFormCheckbox>
            </ProForm>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
