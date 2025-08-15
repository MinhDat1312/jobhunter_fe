import { Button, Col, Divider, Form, Input, Row, Select, notification } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { callRegister } from '../../config/api';
import styles from '../../styles/auth.module.scss';
import { useTranslation } from 'react-i18next';
import VerificationModal from '../../components/verification.modal';

const { Option } = Select;

const RegisterPage = () => {
    const { t } = useTranslation();
    const [isSubmit, setIsSubmit] = useState(false);
    const [typeRegister, setTypeRegister] = useState<string>('applicant');
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');

    const handleChangeType = (value: string) => {
        setTypeRegister(value);
    };

    const onFinish = async (values: any) => {
        const { fullName, username, password, address, contact, type } = values;
        setEmail(contact.email);
        setIsSubmit(true);

        let res = null;
        if (type === 'applicant') {
            res = await callRegister(contact, password as string, type);
        } else {
            res = await callRegister(contact, password as string, type, username, address, fullName);
        }

        setIsSubmit(false);
        if (res?.data?.userId) {
            setOpenModal(true);
        } else {
            notification.error({
                message: t('notify.error'),
                description:
                    res?.message && Array.isArray(res?.message) ? res?.message[0] : res?.message ?? t('notify.error'),
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
                            <h2 className={`${styles.text} ${styles['text-large']}`}>{t('sign_up')}</h2>
                            <Divider />
                        </div>
                        <Form name="basic" onFinish={onFinish} autoComplete="off">
                            <Row gutter={16}>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label={t('email')}
                                        name={['contact', 'email']}
                                        rules={[{ required: true, message: t('notify.required') }]}
                                    >
                                        <Input type="email" />
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Form.Item
                                        label={t('iam')}
                                        name="type"
                                        initialValue="applicant"
                                        labelCol={{ span: 24 }}
                                        rules={[{ required: true }]}
                                    >
                                        <Select onChange={handleChangeType}>
                                            <Option value="applicant">{t('applicant')}</Option>
                                            <Option value="recruiter">{t('recruiter')}</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label={t('password')}
                                        name="password"
                                        rules={[{ required: true, message: t('notify.required') }]}
                                    >
                                        <Input.Password />
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <Form.Item
                                        labelCol={{ span: 24 }}
                                        label={t('re_password')}
                                        name="re-password"
                                        dependencies={['password']}
                                        rules={[
                                            { required: true, message: t('notify.required') },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error(t('notify.re_password')));
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
                                                label={t('fullName')}
                                                name="fullName"
                                                rules={[{ required: true, message: t('notify.required') }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col lg={12} md={12} sm={24} xs={24}>
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                label={t('username')}
                                                name="username"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t('notify.required'),
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
                                                label={t('tel')}
                                                name={['contact', 'phone']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: t('notify.required'),
                                                    },
                                                ]}
                                            >
                                                <Input type="tel" />
                                            </Form.Item>
                                        </Col>
                                        <Col lg={12} md={12} sm={24} xs={24}>
                                            <Form.Item
                                                label={t('address')}
                                                name="address"
                                                labelCol={{ span: 24 }}
                                                rules={[{ required: true, message: t('notify.required') }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </>
                            )}
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    {t('sign_up')}
                                </Button>
                            </Form.Item>
                            <Divider> Or </Divider>
                            <p className="text text-normal">
                                {' '}
                                {t('notify.have_account')}
                                <span>
                                    <Link to="/login" style={{ color: '#00b452' }}>
                                        {' '}
                                        {t('sign_in')}{' '}
                                    </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
            <VerificationModal email={email} openModal={openModal} setOpenModal={setOpenModal} />
        </div>
    );
};

export default RegisterPage;
