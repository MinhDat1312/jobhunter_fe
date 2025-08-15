import { Form, message, Modal, notification } from 'antd';
import { InputOTP } from 'antd-input-otp';
import { useState, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { callResendCode, callVerifyCode } from '../config/api';
import { useNavigate } from 'react-router-dom';

interface IProps {
    email: string;
    openModal: boolean;
    setOpenModal: (value: SetStateAction<boolean>) => void;
    direct?: string;
}

const VerificationModal = (props: IProps) => {
    const { email, openModal, setOpenModal, direct = '/login' } = props;

    const { t } = useTranslation();
    const [loadingResend, setLoadingResend] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onVerify = async () => {
        const { code } = form.getFieldsValue();
        if (!code) {
            message.error(t('notify.verification_code_length'));
            return;
        }

        const res = await callVerifyCode(email, code.join(''));
        if (res && res.data) {
            message.success(t('notify.signup'));
            setOpenModal(false);
            navigate(direct);
        } else {
            notification.error({
                message: t('notify.error'),
                description: res?.message && Array.isArray(res?.message) ? res?.message[0] : res ?? t('notify.error'),
                duration: 5,
            });
        }
    };

    const onResend = async () => {
        setLoadingResend(true);
        const res = await callResendCode(email);

        if (res && res.data) {
            message.success(res.data?.message);
            setLoadingResend(false);
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
        <Modal
            title={t('verification')}
            closable={false}
            maskClosable={false}
            open={openModal}
            onCancel={onResend}
            onOk={onVerify}
            cancelText={t('button.resend')}
            okText={t('button.confirm')}
            cancelButtonProps={{ style: { display: 'inline-block' }, loading: loadingResend }}
            okButtonProps={{ style: { display: 'inline-block' } }}
        >
            <Form form={form} layout="vertical" name="verificationForm">
                <Form.Item
                    label={t('verification')}
                    name="code"
                    rules={[
                        { required: true, message: t('notify.required') },
                        {
                            validator: (_, value: string[] | undefined) => {
                                if (!value || value.length !== 6) {
                                    return Promise.reject(new Error(t('notify.verification_code_length')));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <InputOTP
                        length={6}
                        inputType="numeric"
                        autoFocus
                        onChange={(value: string[]) => {
                            form.setFieldsValue({ code: value });
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default VerificationModal;
