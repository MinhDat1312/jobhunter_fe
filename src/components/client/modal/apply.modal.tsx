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
import { useAppSelector } from '../../../redux/hook';
import viVN from 'antd/es/locale/vi_VN';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { callCreateApplication, callUploadSingleFile } from '../../../config/api';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { eventBus } from '../../../config/eventBus';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    jobDetail: IJob | null;
}

const ApplyModal = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, jobDetail } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const user = useAppSelector((state) => state.account.user);
    const role = user?.role;
    const [urlCV, setUrlCV] = useState<string>('');

    const handleOkButton = async () => {
        if (!urlCV && isAuthenticated && role.active) {
            message.error('Vui lòng upload CV!');
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
                    message.success('Ứng tuyển thành công!');
                    setIsModalOpen(false);
                } else {
                    notification.error({
                        message: 'Ứng tuyển thất bại!',
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
                message.success(`${info.file.name} upload thành công`);
            } else if (info.file.status === 'error') {
                message.error(info?.file?.error?.event?.message ?? 'Đã có lỗi xảy ra khi upload file.');
            }
        },
    };

    return (
        <>
            <Modal
                title="Ứng Tuyển Công Việc"
                open={isModalOpen}
                onOk={() => handleOkButton()}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                okText={!isAuthenticated ? 'Đăng nhập' : role.active ? 'Ứng tuyển' : 'Trang chủ'}
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
                                                Bạn đang ứng tuyển công việc <b>{jobDetail?.title} </b>tại{' '}
                                                <b>{jobDetail?.recruiter?.fullName}</b>
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
                                                label={'Upload file CV'}
                                                rules={[{ required: true, message: 'Vui lòng upload file!' }]}
                                            >
                                                <Upload {...propsUpload}>
                                                    <Button icon={<UploadOutlined />}>
                                                        Tải lên CV của bạn ( Hỗ trợ *.doc, *.docx, *.pdf, and &lt; 5MB )
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
                                title="Truy cập bị từ chối"
                                subTitle="Xin lỗi, bạn không có quyền hạn truy cập thông tin này."
                            />
                        )}
                    </div>
                ) : (
                    <div>Bạn chưa đăng nhập. Vui lòng đăng nhập để có thể "Ứng tuyển" nhé.</div>
                )}
                <Divider />
            </Modal>
        </>
    );
};

export default ApplyModal;
