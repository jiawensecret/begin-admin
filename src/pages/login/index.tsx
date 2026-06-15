import appLogo from '@/assets/app-logo.png';
import { login } from '@/services/login/LoginController';
import { getToken, isTokenExpired, setToken } from '@/utils/auth';
import { history, useModel } from '@umijs/max';
import { message } from 'antd';
import React, { FormEvent, useEffect, useState } from 'react';
import styles from './index.less';

type LoginForm = {
  username: string;
  password: string;
  remember?: boolean;
};

const LoginPage: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
    remember: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setInitialState } = useModel('@@initialState');

  useEffect(() => {
    if (getToken() && !isTokenExpired()) {
      history.replace('/');
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.username.trim()) {
      message.warning('请输入账号');
      return;
    }
    if (!form.password) {
      message.warning('请输入密码');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login({
        username: form.username.trim(),
        password: form.password,
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
    <main className={styles.loginScreen} aria-label="后台管理系统登录页">
      <div className={`${styles.ambient} ${styles.ambientLeft}`} />
      <div className={`${styles.ambient} ${styles.ambientRight}`} />

      <section className={styles.loginPanel} aria-labelledby="login-title">
        <div className={styles.brandMark} aria-hidden="true">
          <img className={styles.brandLogo} src={appLogo} alt="" />
        </div>

        <header className={styles.panelHeader}>
          <p className={styles.eyebrow}>ADMIN CONSOLE</p>
          <h1 id="login-title" className={styles.title}>
            后台管理系统
          </h1>
          <div className={styles.titleRule} aria-hidden="true">
            <span />
          </div>
        </header>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.labelText}>账号</span>
            <span className={styles.inputShell}>
              <span
                className={`${styles.fieldIcon} ${styles.accountIcon}`}
                aria-hidden="true"
              />
              <input
                type="text"
                name="username"
                value={form.username}
                placeholder="请输入账号"
                autoComplete="username"
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    username: event.target.value,
                  }))
                }
              />
            </span>
          </label>

          <label className={styles.field}>
            <span className={styles.labelText}>密码</span>
            <span className={styles.inputShell}>
              <span
                className={`${styles.fieldIcon} ${styles.passwordIcon}`}
                aria-hidden="true"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                placeholder="请输入密码"
                autoComplete="current-password"
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    password: event.target.value,
                  }))
                }
              />
              <button
                className={styles.ghostButton}
                type="button"
                aria-label="显示或隐藏密码"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? '隐藏' : '显示'}
              </button>
            </span>
          </label>

          <div className={styles.formOptions}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    remember: event.target.checked,
                  }))
                }
              />
              <span>记住我</span>
            </label>
            <a
              href="#"
              aria-label="找回密码"
              onClick={(event) => event.preventDefault()}
            >
              忘记密码
            </a>
          </div>

          <button
            className={styles.loginButton}
            type="submit"
            disabled={submitting}
          >
            {submitting ? '登录中...' : '登录'}
          </button>
        </form>

        <footer className={styles.panelFooter} aria-label="系统状态">
          <span className={styles.miniShield} aria-hidden="true" />
          <span>安全</span>
          <span className={styles.dot} aria-hidden="true" />
          <span>稳定</span>
          <span className={styles.dot} aria-hidden="true" />
          <span>高效</span>
        </footer>
      </section>
    </main>
  );
};

export default LoginPage;
