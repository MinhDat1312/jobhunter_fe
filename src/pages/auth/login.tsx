import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callLogin } from '../../config/api';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '../../redux/slice/accountSlice';
import styles from '../../styles/auth.module.scss';
import { useAppSelector } from '../../hooks/hook';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get('callback');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, []);

    const onFinish = async (values: any) => {
        const { email, password } = values;
        setIsSubmit(true);
        const res = await callLogin(email, password);
        setIsSubmit(false);
        if (res?.data) {
            message.success(t('notify.signin'));
            dispatch(setUserLoginInfo(res.data.user));
            navigate(`${callback ? callback : '/'}`);
        } else {
            notification.error({
                message: t('notify.error'),
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5,
            });
        }
    };

    return (
        <div className={styles['login-page']}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={`${styles.wrapper} ${styles.wrapper_login}`}>
                        <div className={styles.heading}>
                            <h2 className={`${styles.text} ${styles['text-large']}`}>{t('sign_in')}</h2>
                            <Divider />
                        </div>
                        <Form name="basic" onFinish={onFinish} autoComplete="off">
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label={t('email')}
                                name="email"
                                rules={[{ required: true, message: t('notify.required') }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label={t('password')}
                                name="password"
                                rules={[{ required: true, message: t('notify.required') }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <div style={{ marginBottom: 24 }}>
                                <Link
                                    to="/reset-password"
                                    style={{ fontSize: 14, fontWeight: 'bolder', color: '#00b452' }}
                                >
                                    {t('button.forgot')} {t('password').toLowerCase()}?
                                </Link>
                            </div>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    {t('sign_in')}
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal">
                                {t('notify.not_account')}
                                <span>
                                    <Link to="/register" style={{ color: '#00b452' }}>
                                        {' '}
                                        {t('sign_up')}{' '}
                                    </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
