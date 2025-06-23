import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ProForm, ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { Col, DatePicker, Form, message, notification, Row, Upload } from 'antd';
import type { FormInstance } from 'antd/lib';
import { EDUCATION_LIST, LEVEL_LIST } from '../../../config/utils';
import type { IFullUser } from '../../../types/backend';
import { v4 as uuidv4 } from 'uuid';
import { DebounceSelect } from '../../admin/debounce.select';
import { fetchRoleList } from '../../admin/applicant/modal.applicant';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { callUpdateApplicant } from '../../../config/api';

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

const ApplicantForm = (props: IProps) => {
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
                            <ProFormText label="Tên ứng viên" name="fullName" placeholder="Nhập tên ứng viên" />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProFormSwitch
                                label="Trạng thái"
                                name="availableStatus"
                                checkedChildren="BẬT"
                                unCheckedChildren="TẮT"
                                initialValue={false}
                            />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>
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
                        <Col md={12} xs={24}>
                            <ProFormText label="Tên hiển thị" name="username" placeholder="Nhập tên đăng nhập" />
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
                    <ProFormText label="Số điện thoại" name={['contact', 'phone']} placeholder="Nhập số điện thoại" />
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
    );
};

export default ApplicantForm;
