import { Card, Col, ConfigProvider, Form, message, notification, Row } from 'antd';
import Access from '../../share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import { useState } from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { CheckSquareOutlined, LoadingOutlined } from '@ant-design/icons';
import { callUpdatePassword } from '../../../config/api';
import { useAppDispatch } from '../../../hooks/hook';
import { setUserLoginInfo } from '../../../redux/slice/accountSlice';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

const UpdatePassword = () => {
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

            message.success('Cập nhật mật khẩu thành công');
            form.resetFields();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
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
                            resetText: 'Hủy',
                            submitText: 'Cập nhật',
                        },
                        render: (_: any, dom: any) => (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>{dom}</div>
                        ),
                        submitButtonProps: {
                            icon: isSubmit ? <LoadingOutlined /> : <CheckSquareOutlined />,
                        },
                    }}
                    style={{
                        marginTop: 20,
                        height: 300,
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <ProFormText.Password
                                label="Mật khẩu hiện tại"
                                name="currentPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Không được để trống!',
                                    },
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                                ]}
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormText.Password
                                label="Mật khẩu mới"
                                name="newPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Không được để trống!',
                                    },
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                                ]}
                                placeholder="Nhập mật khẩu mới"
                            />
                        </Col>
                        <Col span={24}>
                            <ProFormText.Password
                                label="Xác nhận mật khẩu"
                                name="rePassword"
                                dependencies={['newPassword']}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Không được để trống!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
                                        },
                                    }),
                                ]}
                                placeholder="Xác nhận lại mật khẩu"
                            />
                        </Col>
                    </Row>
                </ProForm>
            </Card>
        </Access>
    );
};

export default UpdatePassword;
