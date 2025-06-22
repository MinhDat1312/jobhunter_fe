import { Col, ConfigProvider, DatePicker, Form, message, Modal, notification, Row, Upload } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Access from '../../../share/access';
import { ALL_PERMISSIONS } from '../../../../config/permissions';
import { ProForm, ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { EDUCATION_LIST, LEVEL_LIST } from '../../../../config/utils';
import { callUpdateApplicant, callUploadSingleFile } from '../../../../config/api';
import type { IFullUser } from '../../../../types/backend';
import { v4 as uuidv4 } from 'uuid';
import '../../../../styles/reset.scss';

dayjs.locale('vi');

interface IProps {
    onClose?: (v: boolean) => void;
    dataInit: IFullUser | null;
}

const UpdateInfo = (props: IProps) => {
    const { onClose, dataInit } = props;
    const [form] = Form.useForm();

    const [fileList, setFileList] = useState([
        ...(dataInit?.avatar
            ? [
                  {
                      uid: '-1',
                      name: dataInit.avatar,
                      status: 'done',
                      url: `${import.meta.env.VITE_BACKEND_URL}/storage/applicants/${dataInit.avatar}`,
                  },
              ]
            : []),
    ]);

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const [visibleUpload, setVisibleUpload] = useState(true);

    useEffect(() => {
        if (dataInit?.userId) {
            form.setFieldsValue({
                fullName: dataInit.fullName,
                availableStatus: dataInit.availableStatus,
                username: dataInit.username,
                education: dataInit.education,
                level: dataInit.level,
                contact: dataInit.contact,
                address: dataInit.address,
                gender: dataInit.gender,
                dob: dataInit.dob ? dayjs(dataInit.dob, 'YYYY-MM-DD') : undefined,
            });
        }
    }, [dataInit]);

    const onFinish = async (values: any) => {
        const { fullName, availableStatus, username, education, level, contact, address, gender, dob } = values;

        if (!dataInit || !dataInit.userId) {
            message.error('Không tìm thấy thông tin ứng viên để cập nhật.');
            return;
        }
        const res = await callUpdateApplicant(
            dataInit.userId as string,
            fullName,
            address,
            contact,
            dob,
            gender,
            dataInit.password,
            username,
            availableStatus,
            education,
            level,
            { roleId: dataInit.role?.roleId ?? '', name: '' },
            fileList.length > 0 ? fileList[0].name : '',
        );
        if (res.data) {
            message.success('Cập nhật ứng viên thành công');
            if (onClose) onClose(false);
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message,
            });
        }
    };

    const handleRemoveFile = (file: any) => {
        setFileList([]);
        setVisibleUpload(true);
    };

    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must smaller than 5MB!');
        }
        return isJpgOrPng && isLt5M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
            setVisibleUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? 'Đã có lỗi xảy ra khi upload file.');
        }
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, 'applicants');
        if (res && res.data) {
            setFileList([
                {
                    uid: '-1',
                    name: res.data.fileName,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/storage/applicants/${res.data.fileName}`,
                },
            ]);
            if (onSuccess) onSuccess('ok');
        } else {
            if (onError) {
                setFileList([]);
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };

    return (
        <Access permission={ALL_PERMISSIONS.APPLICANTS.UPDATE}>
            <ConfigProvider locale={viVN}>
                <ProForm
                    form={form}
                    onFinish={onFinish}
                    submitter={{
                        searchConfig: {
                            resetText: 'Hủy',
                            submitText: <>Cập nhật</>,
                        },
                        onReset: () => {
                            if (onClose) onClose(false);
                        },
                        render: (_: any, dom: any) => (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>{dom}</div>
                        ),
                        submitButtonProps: {
                            icon: <CheckSquareOutlined />,
                        },
                    }}
                    style={{
                        height: 400,
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    <Row gutter={16}>
                        <Col lg={20} md={20} sm={24} xs={24}>
                            <Row gutter={16}>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <ProFormText label="Tên ứng viên" name="fullName" placeholder="Nhập tên ứng viên" />
                                </Col>
                                <Col lg={12} md={12} sm={24} xs={24}>
                                    <ProFormSwitch
                                        label="Trạng thái"
                                        name="availableStatus"
                                        checkedChildren="BẬT"
                                        unCheckedChildren="TẮT"
                                        initialValue={false}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col md={12} xs={24}>
                                    <ProFormText
                                        label="Tên hiển thị"
                                        name="username"
                                        placeholder="Nhập tên đăng nhập"
                                    />
                                </Col>
                                <Col lg={6} md={6} sm={24} xs={24}>
                                    <ProFormSelect
                                        name="education"
                                        label="Học vấn"
                                        options={EDUCATION_LIST}
                                        placeholder="Chọn học vấn"
                                    />
                                </Col>
                                <Col lg={6} md={6} sm={24} xs={24}>
                                    <ProFormSelect
                                        name="level"
                                        label="Trình độ"
                                        options={LEVEL_LIST}
                                        placeholder="Chọn trình độ"
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={4} md={4} sm={24} xs={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label={<span style={{ textAlign: 'center' }}>Ảnh đại diện</span>}
                                name="avatar"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                            >
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileLogo}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file)}
                                    onPreview={handlePreview}
                                    defaultFileList={
                                        dataInit?.userId && dataInit?.avatar
                                            ? [
                                                  {
                                                      uid: uuidv4(),
                                                      name: dataInit?.avatar ?? '',
                                                      status: 'done',
                                                      url: `${import.meta.env.VITE_BACKEND_URL}/storage/applicants/${
                                                          dataInit?.avatar
                                                      }`,
                                                  },
                                              ]
                                            : []
                                    }
                                >
                                    {visibleUpload && fileList.length < 1 && (
                                        <div>
                                            {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Tải lên</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col md={10} xs={24}>
                            <ProFormText
                                label="Email"
                                name={['contact', 'email']}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' },
                                ]}
                                placeholder="Nhập email"
                            />
                        </Col>
                        <Col md={10} xs={24}>
                            <ProFormText
                                label="Số điện thoại"
                                name={['contact', 'phone']}
                                placeholder="Nhập số điện thoại"
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col md={10} xs={24}>
                            <ProFormText label="Địa chỉ" name="address" placeholder="Nhập địa chỉ" />
                        </Col>
                        <Col lg={5} md={5} sm={24} xs={24}>
                            <ProFormSelect
                                name="gender"
                                label="Giới tính"
                                valueEnum={{
                                    MALE: 'Nam',
                                    FEMALE: 'Nữ',
                                    OTHER: 'Khác',
                                }}
                                placeholder="Chọn giới tính"
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                            />
                        </Col>
                        <Col lg={5} md={5} sm={24} xs={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ngày sinh"
                                name="dob"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                            >
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>
                </ProForm>
                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={() => setPreviewOpen(false)}
                    style={{ zIndex: 1500 }}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </ConfigProvider>
        </Access>
    );
};

export default UpdateInfo;
