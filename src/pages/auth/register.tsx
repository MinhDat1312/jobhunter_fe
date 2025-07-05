import { Button, Col, ConfigProvider, Divider, Form, Input, Row, Select, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from '../../config/api';
import styles from '../../styles/auth.module.scss';
const { Option } = Select;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const [typeRegister, setTypeRegister] = useState<string>('applicant');

    const handleChangeType = (value: string) => {
        setTypeRegister(value);
    };

    const onFinish = async (values: any) => {
        const { fullName, username, password, address, contact, type } = values;
        setIsSubmit(true);

        let res = null;
        if (type === 'applicant') {
            res = await callRegister(contact, password as string, type);
        } else {
            res = await callRegister(contact, password as string, type, username, address, fullName);
        }

        setIsSubmit(false);
        if (res?.data?.userId) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login');
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description:
                    res?.message && Array.isArray(res?.message)
                        ? res?.message[0]
                        : res?.message ?? 'Đã xảy ra lỗi không xác định',
                duration: 5,
            });
        }
    };

    return (
        <div className={styles['register-page']}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <div className={styles.heading}>
                            <h2 className={`${styles.text} ${styles['text-large']}`}> Đăng Ký Tài Khoản </h2>
                            <Divider />
                        </div>
                        <Form name="basic" onFinish={onFinish} autoComplete="off">
                            <Row gutter={16}>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Email"
                                        name={['contact', 'email']}
                                        rules={[{ required: true, message: 'Email không được để trống!' }]}
                                    >
                                        <Input type="email" />
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Form.Item
                                        label="Tôi là"
                                        name="type"
                                        initialValue="applicant"
                                        labelCol={{ span: 24 }}
                                        rules={[{ required: true }]}
                                    >
                                        <Select onChange={handleChangeType}>
                                            <Option value="applicant">Ứng viên</Option>
                                            <Option value="recruiter">Nhà tuyển dụng</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Mật khẩu"
                                        name="password"
                                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Nhập lại mật khẩu"
                                        name="re-password"
                                        dependencies={['password']}
                                        rules={[
                                            { required: true, message: 'Nhập lại mật khẩu không được để trống!' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                </Col>
                            </Row>
                            {typeRegister !== 'applicant' && (
                                <>
                                    <Row gutter={16}>
                                        <Col lg={12} md={12} sm={24} xs={24}>
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                label="Họ tên"
                                                name="fullName"
                                                rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col lg={12} md={12} sm={24} xs={24}>
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                label="Tên đăng nhập"
                                                name="username"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Tên đăng nhập không được để trống!',
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col lg={12} md={12} sm={24} xs={24}>
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                label="Số điện thoại"
                                                name={['contact', 'phone']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Số điện thoại không được để trống!',
                                                    },
                                                ]}
                                            >
                                                <Input type="tel" />
                                            </Form.Item>
                                        </Col>
                                        <Col lg={12} md={12} sm={24} xs={24}>
                                            <Form.Item
                                                name="address"
                                                label="Địa chỉ"
                                                labelCol={{ span: 24 }}
                                                rules={[{ required: true, message: 'Không được để trống!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </>
                            )}
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng ký
                                </Button>
                            </Form.Item>
                            <Divider> Or </Divider>
                            <p className="text text-normal">
                                {' '}
                                Đã có tài khoản ?
                                <span>
                                    <Link to="/login" style={{ color: '#00b452' }}>
                                        {' '}
                                        Đăng Nhập{' '}
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

export default RegisterPage;
