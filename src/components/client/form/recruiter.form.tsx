import { Col, Form, message, notification, Row, Upload, type FormInstance } from 'antd';
import type { IFullUser } from '../../../types/backend';
import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { DebounceSelect } from '../../admin/debounce.select';
import { useEffect, useState } from 'react';
import { fetchRoleList } from '../../admin/applicant/modal.applicant';
import ReactQuill from 'react-quill';
import { callUpdateRecruiter } from '../../../config/api';

interface IProps {
    dataInit: IFullUser | null;
    onClose?: (v: boolean) => void;
    uploadFileLogo: (options: any) => Promise<void>;
    beforeUpload: (file: any) => boolean;
    onChange: (info: any) => void;
    removeFile: (file: any) => void;
    onPreview: (file: any) => Promise<void>;
    visibleUpload?: boolean;
    loadingUpload?: boolean;
    fileList: any;
}

interface IRoleSelect {
    label: string;
    value: string;
    key?: string;
}

const RecruiterForm = (props: IProps) => {
    const {
        dataInit,
        onClose,
        uploadFileLogo,
        beforeUpload,
        onChange,
        removeFile,
        onPreview,
        visibleUpload,
        loadingUpload,
        fileList,
    } = props;
    const [roles, setRoles] = useState<IRoleSelect[]>([]);
    const [description, setDescription] = useState<string>('');
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.userId) {
            if (dataInit.role) {
                setRoles([
                    {
                        label: dataInit.role?.name,
                        value: dataInit.role?.roleId,
                        key: dataInit.role?.roleId,
                    },
                ]);
            }

            if (dataInit.description) {
                setDescription(dataInit.description);
            }

            form.setFieldsValue({
                fullName: dataInit.fullName,
                username: dataInit.username,
                contact: dataInit.contact,
                address: dataInit.address,
            });
        }
    }, [dataInit]);

    const onFinish = async (values: any) => {
        const { fullName, username, contact, address } = values;

        if (!dataInit || !dataInit.userId) {
            message.error('Không tìm thấy thông tin nhà tuyển dụng để cập nhật.');
            return;
        }
        const res = await callUpdateRecruiter(
            dataInit.userId as string,
            fullName,
            dataInit.password,
            username,
            contact,
            address,
            description,
            fileList.length > 0 ? fileList[0].name : '',
            { roleId: dataInit.role?.roleId ?? '', name: '' },
        );
        if (res.data) {
            message.success('Cập nhật nhà tuyển dụng thành công');
            if (onClose) onClose(false);
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message,
            });
        }
    };

    return (
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
                            <ProFormText
                                label="Tên nhà tuyển dụng"
                                name="fullName"
                                placeholder="Nhập tên nhà tuyển dụng"
                                rules={[{ required: true, message: 'Vui lòng nhập tên nhà tuyển dụng' }]}
                            />
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProForm.Item name="role" label="Vai trò">
                                <DebounceSelect
                                    disabled
                                    allowClear
                                    showSearch
                                    value={roles}
                                    placeholder="Chọn vai trò"
                                    fetchOptions={fetchRoleList}
                                    onChange={(newValue: any) => {
                                        setRoles(newValue as IRoleSelect[]);
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </ProForm.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText
                                label="Tên hiển thị"
                                name="username"
                                placeholder="Nhập tên đăng nhập"
                                rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
                            />
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
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
                            customRequest={uploadFileLogo}
                            beforeUpload={beforeUpload}
                            onChange={onChange}
                            onRemove={(file) => removeFile(file)}
                            onPreview={onPreview}
                            defaultFileList={
                                dataInit?.userId && dataInit?.avatar
                                    ? [
                                          {
                                              uid: uuidv4(),
                                              name: dataInit?.avatar ?? '',
                                              status: 'done',
                                              url: `${import.meta.env.VITE_BACKEND_URL}/storage/recruiters/${
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
                        label="Số điện thoại"
                        name={['contact', 'phone']}
                        placeholder="Nhập số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    />
                </Col>
                <Col md={10} xs={24}>
                    <ProFormText
                        label="Địa chỉ"
                        name="address"
                        placeholder="Nhập địa chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    />
                </Col>
            </Row>
            <ProCard
                title="Mô tả"
                headStyle={{ color: '#d81921' }}
                style={{ marginBottom: 20 }}
                headerBordered
                size="small"
                bordered
            >
                <Col span={24}>
                    <ReactQuill theme="snow" value={description} onChange={setDescription} />
                </Col>
            </ProCard>
        </ProForm>
    );
};

export default RecruiterForm;
