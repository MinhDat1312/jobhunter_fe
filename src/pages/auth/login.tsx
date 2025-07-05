import { Button, ConfigProvider, Divider, Form, Input, message, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callLogin } from '../../config/api';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '../../redux/slice/accountSlice';
import styles from '../../styles/auth.module.scss';
import { useAppSelector } from '../../hooks/hook';

const LoginPage = () => {
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
            localStorage.setItem('access_token', res.data.access_token);
            message.success('Đăng nhập tài khoản thành công!');
            dispatch(setUserLoginInfo(res.data.user));
            navigate(`${callback ? callback : '/'}`);
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
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
                            <h2 className={`${styles.text} ${styles['text-large']}`}>Đăng Nhập</h2>
                            <Divider />
                        </div>
                        <Form name="basic" onFinish={onFinish} autoComplete="off">
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal">
                                Chưa có tài khoản ?
                                <span>
                                    <Link to="/register" style={{ color: '#00b452' }}>
                                        {' '}
                                        Đăng Ký{' '}
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
