import { Card, Col, Form, message, notification, Row } from 'antd';
import Access from '../../share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import { useState } from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { CheckSquareOutlined, LoadingOutlined } from '@ant-design/icons';
import { callUpdatePassword } from '../../../config/api';
import { useAppDispatch } from '../../../hooks/hook';
import { setUserLoginInfo } from '../../../redux/slice/accountSlice';
import { Grid } from 'antd';
import { useTranslation } from 'react-i18next';

const { useBreakpoint } = Grid;

const UpdatePassword = () => {
    const { t } = useTranslation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;

    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const dispatch = useAppDispatch();

    const onFinish = async (values: any) => {
        const { currentPassword, newPassword, rePassword } = values;

        setIsSubmit(true);
        const res = await callUpdatePassword(currentPassword, newPassword, rePassword);
        setIsSubmit(false);
        if (res.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(setUserLoginInfo(res.data.user));

            message.success(t('notify.success_update_password'));
            form.resetFields();
        } else {
            notification.error({
                message: t('notify.error'),
                description: res.message,
            });
        }
    };

    const onReset = async () => {
        form.resetFields();
    };

    return (
        <Access permission={[ALL_PERMISSIONS.APPLICANTS.UPDATE, ALL_PERMISSIONS.RECRUITERS.UPDATE]}>
            <Card
                style={{
                    marginBlock: '32px',
                    marginRight: isMobile || isTablet ? '0px' : '100px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <ProForm
                    form={form}
                    onFinish={onFinish}
                    onReset={onReset}
                    submitter={{
                        searchConfig: {
                            resetText: t('button.cancel'),
                            submitText: t('button.update'),
                        },
                        render: (_: any, dom: any) => (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>{dom}</div>
                        ),
                        submitButtonProps: {
                            icon: isSubmit ? <LoadingOutlined /> : <CheckSquareOutlined />,
                        },
                    }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <ProFormText.Password
                                label={t('current_password')}
                                name="currentPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: t('notify.required'),
                                    },
                                    { min: 6, message: t('notify.least_6') },
                                ]}
                                placeholder={t('placeholder')}
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormText.Password
                                label={t('new_password')}
                                name="newPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: t('notify.required'),
                                    },
                                    { min: 6, message: t('notify.least_6') },
                                ]}
                                placeholder={t('placeholder')}
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormText.Password
                                label={t('re_password')}
                                name="rePassword"
                                dependencies={['newPassword']}
                                rules={[
                                    {
                                        required: true,
                                        message: t('notify.required'),
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t('notify.re_password')));
                                        },
                                    }),
                                ]}
                                placeholder={t('placeholder')}
                            />
                        </Col>
                    </Row>
                </ProForm>
            </Card>
        </Access>
    );
};

export default UpdatePassword;
