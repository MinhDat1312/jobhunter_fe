import { Button, Descriptions, Drawer, Form, message, notification, Select } from 'antd';
import type { IApplication } from '../../../types/backend';
import { useState } from 'react';
import { callUpdateApplicationStatus } from '../../../config/api';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IApplication | null | any;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
    isAdmin: boolean;
    isMobile: boolean;
}

const ViewDetailApplication = (props: IProps) => {
    const { t } = useTranslation();
    const { onClose, open, dataInit, setDataInit, reloadTable, isAdmin, isMobile } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [form] = Form.useForm();

    const handleChangeStatus = async () => {
        setIsSubmit(true);

        const status = form.getFieldValue('status');
        const res = await callUpdateApplicationStatus(dataInit?.applicationId, status, dataInit?.resumeUrl);
        if (res.data) {
            message.success(t('notify.success_update_status'));
            setDataInit(null);
            onClose(false);
            reloadTable();
        } else {
            notification.error({
                message: t('notify.error'),
                description: res.message,
            });
        }

        setIsSubmit(false);
    };

    return (
        <>
            <Drawer
                title={t('title_application')}
                placement="right"
                onClose={() => {
                    onClose(false);
                    setDataInit(null);
                }}
                open={open}
                width={isMobile ? '100vw' : '50vw'}
                maskClosable={false}
                extra={
                    isAdmin ? (
                        <></>
                    ) : (
                        <Button loading={isSubmit} type="primary" onClick={handleChangeStatus}>
                            {t('button.update')}
                        </Button>
                    )
                }
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label={t('email')}>{dataInit?.email}</Descriptions.Item>
                    <Descriptions.Item label={t('status')}>
                        <Form form={form}>
                            <Form.Item name={'status'}>
                                <Select style={{ width: '100%' }} defaultValue={dataInit?.status} disabled={isAdmin}>
                                    <Option value="PENDING">{t('status_application.pending')}</Option>
                                    <Option value="ACCEPTED">{t('status_application.accepted')}</Option>
                                    <Option value="REJECTED">{t('status_application.rejected')}</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('job')}>{dataInit?.job?.title}</Descriptions.Item>
                    <Descriptions.Item label={t('recruiter')}>{dataInit?.recruiterName}</Descriptions.Item>
                    <Descriptions.Item label={t('table.createdAt')}>
                        {dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('table.updatedAt')}>
                        {dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ''}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
};

export default ViewDetailApplication;
