import { Col, Form, message, notification, Row, Upload, type FormInstance } from 'antd';
import type { IFullUser, ISelect } from '../../../types/backend';
import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { DebounceSelect } from '../../admin/debounce.select';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { callCreateRecruiter, callUpdateRecruiter } from '../../../config/api';
import { fetchRoleList } from '../../../config/utils';

interface IProps {
    form: FormInstance<any>;
    dataInit: IFullUser | null;
    setDataInit?: (v: any) => void;
    onClose?: (v: boolean) => void;
    uploadFileLogo: (options: any) => Promise<void>;
    beforeUpload: (file: any) => boolean;
    onChange: (info: any) => void;
    removeFile: (file: any) => void;
    onPreview: (file: any) => Promise<void>;
    visibleUpload?: boolean;
    setVisibleUpload?: (v: any) => void;
    loadingUpload?: boolean;
    fileList: any;
    setFileList?: (v: any) => void;
    onRole: boolean;
    reloadTable?: () => void;
}

const RecruiterForm = (props: IProps) => {
    const {
        form,
        dataInit,
        setDataInit,
        onClose,
        uploadFileLogo,
        beforeUpload,
        onChange,
        removeFile,
        onPreview,
        visibleUpload,
        setVisibleUpload,
        loadingUpload,
        fileList,
        setFileList,
        onRole,
        reloadTable,
    } = props;
    const [roles, setRoles] = useState<ISelect[]>([]);
    const [description, setDescription] = useState<string>('');

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
        } else {
            form.resetFields();
        }
    }, [dataInit]);

    const onFinish = async (values: any) => {
        const { fullName, username, contact, address } = values;
        let { role } = values;
        let { password } = values;

        if (typeof role === 'number') {
            role = {
                roleId: role,
                name: '',
            };
        } else {
            role = dataInit?.role;
        }

        if (dataInit?.userId) {
            const res = await callUpdateRecruiter(
                dataInit.userId as string,
                fullName,
                !onRole ? dataInit.password : '12345678',
                username,
                contact,
                address,
                description,
                fileList.length > 0 ? fileList[0].url : '',
                !onRole
                    ? { roleId: dataInit.role?.roleId ?? '', name: '' }
                    : role
                    ? { roleId: role.roleId, name: role.name }
                    : undefined,
            );
            if (res.data) {
                message.success('Cập nhật nhà tuyển dụng thành công');
                if (onClose) onClose(false);
                if (reloadTable) reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        } else {
            const res = await callCreateRecruiter(
                fullName,
                password,
                username,
                contact,
                address,
                description,
                fileList.length > 0 ? fileList[0].url : '',
                { roleId: role.roleId, name: role.name },
            );
            if (res.data) {
                message.success('Thêm mới nhà tuyển dụng thành công');
                if (onClose) onClose(false);
                if (reloadTable) reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        }
        if (setVisibleUpload) setVisibleUpload(true);
        if (setFileList) setFileList([]);
    };

    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            submitter={{
                searchConfig: {
                    resetText: 'Hủy',
                    submitText: <>{dataInit?.userId ? 'Cập nhật' : 'Tạo mới'}</>,
                },
                resetButtonProps: {
                    preventDefault: true,
                    onClick: () => {
                        if (onClose) {
                            if (setDataInit) setDataInit(null);
                            onClose(false);
                            setRoles([]);
                            if (setFileList) setFileList([]);
                        }
                    },
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
                                    disabled={onRole ? false : true}
                                    allowClear
                                    showSearch
                                    value={roles}
                                    placeholder="Chọn vai trò"
                                    fetchOptions={fetchRoleList}
                                    onChange={(newValue: any) => {
                                        setRoles(newValue as ISelect[]);
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </ProForm.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        {!onRole ? (
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProFormText
                                    label="Tên hiển thị"
                                    name="username"
                                    placeholder="Nhập tên đăng nhập"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống tên đăng nhập' }]}
                                />
                            </Col>
                        ) : (
                            <>
                                <Col lg={6} md={6} sm={24} xs={24}>
                                    <ProFormText
                                        label="Tên hiển thị"
                                        name="username"
                                        placeholder="Nhập tên đăng nhập"
                                        rules={[{ required: true, message: 'Vui lòng không bỏ trống tên đăng nhập' }]}
                                    />
                                </Col>
                                <Col lg={6} md={6} sm={24} xs={24}>
                                    <ProFormText
                                        disabled={dataInit?.userId ? true : false}
                                        label="Mật khẩu"
                                        name="password"
                                        rules={[
                                            () => ({
                                                validator(_, value) {
                                                    if (!dataInit?.userId && !value) {
                                                        return Promise.reject('Vui lòng nhập mật khẩu');
                                                    }
                                                    return Promise.resolve();
                                                },
                                            }),
                                        ]}
                                        placeholder="Nhập mật khẩu"
                                    />
                                </Col>
                            </>
                        )}
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
                                              name: dataInit?.fullName ?? '',
                                              status: 'done',
                                              url: `${dataInit?.avatar}`,
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
