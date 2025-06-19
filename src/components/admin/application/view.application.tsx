import { Button, Descriptions, Drawer, Form, message, notification, Select } from 'antd';
import type { IApplication } from '../../../types/backend';
import { useState } from 'react';
import { callUpdateApplicationStatus } from '../../../config/api';
import dayjs from 'dayjs';

const { Option } = Select;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IApplication | null | any;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ViewDetailApplication = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit, reloadTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [form] = Form.useForm();

    const handleChangeStatus = async () => {
        setIsSubmit(true);

        const status = form.getFieldValue('status');
        const res = await callUpdateApplicationStatus(dataInit?.applicationId, status, dataInit?.resumeUrl);
        if (res.data) {
            message.success('Cập nhật trạng thái thành công!');
            setDataInit(null);
            onClose(false);
            reloadTable();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message,
            });
        }

        setIsSubmit(false);
    };

    return (
        <>
            <Drawer
                title="Thông tin hồ sơ ứng tuyển"
                placement="right"
                onClose={() => {
                    onClose(false);
                    setDataInit(null);
                }}
                open={open}
                width={'40vw'}
                maskClosable={false}
                extra={
                    <Button loading={isSubmit} type="primary" onClick={handleChangeStatus}>
                        Cập nhật
                    </Button>
                }
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label="Email">{dataInit?.email}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Form form={form}>
                            <Form.Item name={'status'}>
                                <Select style={{ width: '100%' }} defaultValue={dataInit?.status}>
                                    <Option value="PENDING">Đang xét</Option>
                                    <Option value="ACCEPTED">Chấp nhận</Option>
                                    <Option value="REJECTED">Từ chối</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên tin tuyển dụng">{dataInit?.job?.title}</Descriptions.Item>
                    <Descriptions.Item label="Tên nhà tuyển dụng">{dataInit?.recruiterName}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa">
                        {dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ''}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
};

export default ViewDetailApplication;
