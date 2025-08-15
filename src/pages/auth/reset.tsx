import { Button, Form, Input, message, Modal, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VerificationModal from '../../components/verification.modal';
import { callResendCode, callResetPassword } from '../../config/api';

const ResetPassword = () => {
    const { t } = useTranslation();
    const [emailModal, setEmailModal] = useState<boolean>(true);
    const [codeModal, setCodeModal] = useState<boolean>(false);
    const [passwordModal, setPasswordModal] = useState<boolean>(false);
    const [emailTmp, setEmailTmp] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!emailModal && !codeModal) {
            setPasswordModal(true);
        }
    }, [emailModal, codeModal]);

    const onFinish = async (values: any) => {
        const { email } = values;
        setEmailTmp(email);
        setLoading(true);

        const res = await callResendCode(email);
        if (res && res.data) {
            message.success(res.data?.message);
            setLoading(false);
            setEmailModal(false);
            setCodeModal(true);
        } else {
            notification.error({
                message: t('notify.error'),
                description:
                    res?.message && Array.isArray(res?.message) ? res?.message[0] : res?.message ?? t('notify.error'),
                duration: 5,
            });
        }
    };

    const onResetPassword = async (values: any) => {
        const { password } = values;
        const res = await callResetPassword(emailTmp, password as string);
        if (res && res.data) {
            message.success(res.data?.message);
            navigate('/login');
        } else {
            notification.error({
                message: t('notify.error'),
                description: res?.message && Array.isArray(res?.message) ? res?.message[0] : res ?? t('notify.error'),
                duration: 5,
            });
        }
    };

    return (
        <>
            <Modal
                title={t('button.confirm') + ' ' + 'email'}
                closable={false}
                maskClosable={false}
                mask={false}
                open={emailModal}
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }}
            >
                <Form name="verify-email" layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label={t('notify.reset_email')}
                        name="email"
                        rules={[{ required: true, message: t('notify.required') }]}
                    >
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            {t('button.confirm')}
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Link
                        to="/login"
                        style={{
                            fontSize: '1rem',
                            fontWeight: 'bolder',
                            color: '#00b452',
                            textDecoration: 'none',
                        }}
                    >
                        {t('sign_in')}
                    </Link>
                </div>
            </Modal>
            <VerificationModal
                email={emailTmp}
                openModal={codeModal}
                setOpenModal={setCodeModal}
                direct="/reset-password"
            />
            <Modal
                title={t('reset') + ' ' + t('password').toLowerCase()}
                closable={false}
                maskClosable={false}
                mask={false}
                open={passwordModal}
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }}
            >
                <Form name="reset-password" layout="vertical" onFinish={onResetPassword}>
                    <Form.Item
                        label={t('password')}
                        name="password"
                        rules={[{ required: true, message: t('notify.required') }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            {t('reset')}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ResetPassword;
