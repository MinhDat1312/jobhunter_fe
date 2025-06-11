import { Button, Col, DatePicker, Divider, Form, Input, Row, Select, message, notification } from 'antd';
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
        console.log(values);

        const { fullName, username, password, dob, gender, address, contact, type } = values;
        setIsSubmit(true);
        const res = await callRegister(fullName, contact, address, password as string, username, type, dob, gender);
        setIsSubmit(false);
        if (res?.data?.userId) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login');
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
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
                                <Col span={12}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Họ tên"
                                        name="fullName"
                                        rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Vai trò"
                                        name="type"
                                        initialValue="applicant"
                                        labelCol={{ span: 24 }}
                                    >
                                        <Select onChange={handleChangeType}>
                                            <Option value="applicant">Ứng viên</Option>
                                            <Option value="recruiter">Nhà tuyển dụng</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Tên đăng nhập"
                                        name="username"
                                        rules={[{ required: true, message: 'Tên đăng nhập không được để trống!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Mật khẩu"
                                        name="password"
                                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Email"
                                        name={['contact', 'email']}
                                        rules={[{ required: true, message: 'Email không được để trống!' }]}
                                    >
                                        <Input type="email" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label="Số điện thoại"
                                        name={['contact', 'phone']}
                                        rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                                    >
                                        <Input type="tel" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {typeRegister === 'applicant' && (
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            labelCol={{ span: 24 }}
                                            label="Giới tính"
                                            name="gender"
                                            rules={[{ required: true, message: 'Giới tính không được để trống!' }]}
                                        >
                                            <Select allowClear>
                                                <Option value="MALE">Nam</Option>
                                                <Option value="FEMALE">Nữ</Option>
                                                <Option value="OTHER">Khác</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            labelCol={{ span: 24 }}
                                            label="Ngày sinh"
                                            name="dob"
                                            rules={[{ required: true, message: 'Ngày sinh không được để trống!' }]}
                                        >
                                            <DatePicker style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}

                            <Form.Item labelCol={{ span: 24 }}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name={['address', 'number']}
                                            label="Số nhà"
                                            labelCol={{ span: 24 }}
                                            rules={[{ required: true, message: 'Không được để trống!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name={['address', 'street']}
                                            label="Đường"
                                            labelCol={{ span: 24 }}
                                            rules={[{ required: true, message: 'Không được để trống!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name={['address', 'ward']}
                                            label="Phường/Xã"
                                            labelCol={{ span: 24 }}
                                            rules={[{ required: true, message: 'Không được để trống!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name={['address', 'district']}
                                            label="Quận/Huyện"
                                            labelCol={{ span: 24 }}
                                            rules={[{ required: true, message: 'Không được để trống!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name={['address', 'city']}
                                            label="Tỉnh/Thành phố"
                                            labelCol={{ span: 24 }}
                                            rules={[{ required: true, message: 'Không được để trống!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            name={['address', 'country']}
                                            label="Quốc gia"
                                            labelCol={{ span: 24 }}
                                            rules={[{ required: true, message: 'Không được để trống!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form.Item>

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
                                    <Link to="/login"> Đăng Nhập </Link>
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
