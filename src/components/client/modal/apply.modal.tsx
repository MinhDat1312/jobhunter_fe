import {
    Button,
    Col,
    ConfigProvider,
    Divider,
    message,
    Modal,
    notification,
    Result,
    Row,
    Upload,
    type UploadProps,
} from 'antd';
import type { IJob } from '../../../types/backend';
import viVN from 'antd/es/locale/vi_VN';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { callCreateApplication, callUploadSingleFile } from '../../../config/api';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { eventBus } from '../../../config/eventBus';
import { useAppSelector } from '../../../hooks/hook';
import { useTranslation } from 'react-i18next';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    jobDetail: IJob | null;
}

const ApplyModal = (props: IProps) => {
    const { t } = useTranslation();

    const { isModalOpen, setIsModalOpen, jobDetail } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const user = useAppSelector((state) => state.account.user);
    const role = user?.role;
    const [urlCV, setUrlCV] = useState<string>('');

    const handleOkButton = async () => {
        if (!urlCV && isAuthenticated && role.active) {
            message.error(t('notify.upload_cv'));
            return;
        }

        if (!isAuthenticated) {
            setIsModalOpen(false);
            navigate(`/login?callback=${location.pathname}${location.search}`);
        } else if (!role.active) {
            setIsModalOpen(false);
            navigate(`/`);
        } else {
            if (jobDetail) {
                const res = await callCreateApplication(urlCV, user.email, jobDetail?.jobId, user.userId);
                if (res.data) {
                    eventBus.emit('jobApplied');
                    message.success(t('notify.applied'));
                    setIsModalOpen(false);
                } else {
                    notification.error({
                        message: t('notify.applied_fail'),
                        description: res.message,
                    });
                }
            }
        }
    };

    const propsUpload: UploadProps = {
        maxCount: 1,
        multiple: false,
        accept: 'application/pdf,application/msword, .doc, .docx, .pdf',
        async customRequest({ file, onSuccess, onError }: any) {
            const res = await callUploadSingleFile(file, 'resumes');
            if (res && res.data) {
                setUrlCV(res.data.url);
                if (onSuccess) onSuccess('ok');
            } else {
                if (onError) {
                    setUrlCV('');
                    const error = new Error(res.message);
                    onError({ event: error });
                }
            }
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name}` + ' ' + t('notify.success_upload').toLowerCase());
            } else if (info.file.status === 'error') {
                message.error(info?.file?.error?.event?.message ?? t('notify.error'));
            }
        },
        onRemove(_file) {
            setUrlCV('');
            return true;
        },
    };

    return (
        <>
            <Modal
                title={t('title_apply')}
                open={isModalOpen}
                onOk={() => handleOkButton()}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                okText={!isAuthenticated ? t('sign_in') : role.active ? t('button.apply') : t('home')}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <Divider />
                {isAuthenticated ? (
                    <div>
                        {role.active ? (
                            <ConfigProvider locale={viVN}>
                                <ProForm
                                    submitter={{
                                        render: () => <></>,
                                    }}
                                >
                                    <Row gutter={[10, 10]}>
                                        <Col span={24}>
                                            <div>
                                                {t('body_apply')} <b>{jobDetail?.title} </b>
                                                {t('at')} <b>{jobDetail?.recruiter?.fullName}</b>
                                            </div>
                                        </Col>
                                        <Col span={24}>
                                            <ProFormText
                                                fieldProps={{
                                                    type: 'email',
                                                }}
                                                label="Email"
                                                name={'email'}
                                                labelAlign="right"
                                                disabled
                                                initialValue={user?.email}
                                            />
                                        </Col>
                                        <Col span={24}>
                                            <ProForm.Item
                                                label={t('cv_for')}
                                                rules={[{ required: true, message: t('notify.upload_cv') }]}
                                                style={{ width: '100%' }}
                                            >
                                                <Upload {...propsUpload} style={{ width: '100%' }}>
                                                    <Button icon={<UploadOutlined />} style={{ width: '100%' }}>
                                                        {t('upload')} CV (.doc, .docx, .pdf, and &lt; 2MB)
                                                    </Button>
                                                </Upload>
                                            </ProForm.Item>
                                        </Col>
                                    </Row>
                                </ProForm>
                            </ConfigProvider>
                        ) : (
                            <Result
                                status="403"
                                title={t('page_error.result.title')}
                                subTitle={t('page_error.result.subTitle')}
                            />
                        )}
                    </div>
                ) : (
                    <div>{t('signin_apply')}</div>
                )}
                <Divider />
            </Modal>
        </>
    );
};

export default ApplyModal;
