import {
    FooterToolbar,
    ModalForm,
    ProForm,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
} from '@ant-design/pro-components';
import type { IApplicant } from '../../../types/backend';
import { Col, ConfigProvider, DatePicker, Form, message, Modal, notification, Row, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { DebounceSelect } from '../debounce.select';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';
import { callCreateApplicant, callFetchRole, callUpdateApplicant, callUploadSingleFile } from '../../../config/api';
import viVN from 'antd/es/locale/vi_VN';
import dayjs from 'dayjs';
import type { IRecruiterAvatar } from '../recruiter/modal.recruiter';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IApplicant | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

export interface IApplicantSelect {
    label: string;
    value: string;
    key?: string;
}

export async function fetchRoleList(name: string): Promise<IApplicantSelect[]> {
    const q: any = {
        page: 1,
        size: 100,
        filter: '',
    };
    q.filter = `${sfLike('name', name)}`;
    if (!q.filter) delete q.filter;
    let temp = queryString.stringify(q);

    const res = await callFetchRole(temp);
    if (res && res.data) {
        const list = res.data.result;
        const temp = list.map((item) => {
            return {
                label: item.name as string,
                value: item.roleId as string,
            };
        });
        return temp;
    } else return [];
}

const ModalApplicant = (props: IProps) => {
    const { openModal, setOpenModal, dataInit, setDataInit, reloadTable } = props;

    const [animation, setAnimation] = useState<string>('open');
    const [roles, setRoles] = useState<IApplicantSelect[]>([]);

    const [form] = Form.useForm();

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [dataAvatar, setDataAvatar] = useState<IRecruiterAvatar[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState<any[]>([]);

    useEffect(() => {
        if (dataInit?.userId) {
            setFileList([
                {
                    uid: '-1',
                    name: dataInit.fullName,
                    status: 'done',
                    url: `${dataInit.avatar}`,
                },
            ]);
        }
        if (dataInit?.userId && dataInit.role) {
            setRoles([
                {
                    label: dataInit.role?.name,
                    value: dataInit.role?.roleId,
                    key: dataInit.role?.roleId,
                },
            ]);
        }
    }, [dataInit]);

    const submitApplicant = async (valuesForm: any) => {
        const { fullName, availableStatus, username, education, level, contact, address, gender, dob } = valuesForm;
        let { role } = valuesForm;
        let { password } = valuesForm;

        if (typeof role === 'number') {
            role = {
                roleId: role,
                name: '',
            };
        }
        if (dataInit?.userId) {
            password = '0123456789';
            const res = await callUpdateApplicant(
                dataInit.userId,
                fullName,
                address,
                contact,
                dob,
                gender,
                password,
                username,
                availableStatus,
                education,
                level,
                role ? role : undefined,
                fileList.length > 0 ? fileList[0].name : '',
            );
            if (res.data) {
                message.success('Cập nhật ứng viên thành công');
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        } else {
            const res = await callCreateApplicant(
                fullName,
                address,
                contact,
                dob,
                gender,
                password,
                username,
                availableStatus,
                education,
                level,
                role ? role : undefined,
                fileList.length > 0 ? fileList[0].name : '',
            );
            if (res.data) {
                message.success('Thêm mới ứng viên thành công');
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        }
    };

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setRoles([]);

        setAnimation('close');
        await new Promise((r) => setTimeout(r, 400));
        setOpenModal(false);
        setAnimation('open');
    };

    const handleRemoveFile = (file: any) => {
        setDataAvatar([]);
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
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? 'Đã có lỗi xảy ra khi upload file.');
        }
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
        // const res = await callUploadSingleFile(file, 'applicants');
        // if (res && res.data) {
        //     setDataAvatar([
        //         {
        //             name: res.data.url,
        //             uid: uuidv4(),
        //         },
        //     ]);
        //     if (onSuccess) onSuccess('ok');
        // } else {
        //     if (onError) {
        //         setDataAvatar([]);
        //         const error = new Error(res.message);
        //         onError({ event: error });
        //     }
        // }

        const res = await callUploadSingleFile(file, 'applicants');
        if (res && res.data) {
            setFileList([
                {
                    uid: '-1',
                    name: res.data.url,
                    status: 'done',
                    url: `${res.data.url}`,
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
        <>
            {openModal && (
                <ConfigProvider locale={viVN}>
                    <ModalForm
                        title={<>{dataInit?.userId ? 'Cập nhật ứng viên' : 'Tạo mới ứng viên'}</>}
                        open={openModal}
                        modalProps={{
                            onCancel: () => {
                                handleReset();
                            },
                            afterClose: () => handleReset(),
                            destroyOnHidden: true,
                            width: isMobile ? '100%' : 900,
                            footer: null,
                            keyboard: false,
                            maskClosable: false,
                            className: `modal-applicant ${animation}`,
                            rootClassName: `modal-applicant-root ${animation}`,
                        }}
                        scrollToFirstError={true}
                        preserve={false}
                        form={form}
                        onFinish={submitApplicant}
                        initialValues={
                            dataInit?.userId
                                ? {
                                      ...dataInit,
                                      dob: dataInit.dob ? dayjs(dataInit.dob) : undefined,
                                  }
                                : {}
                        }
                        submitter={{
                            render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                            submitButtonProps: {
                                icon: <CheckSquareOutlined />,
                            },
                            searchConfig: {
                                resetText: 'Hủy',
                                submitText: <>{dataInit?.userId ? 'Cập nhật' : 'Tạo mới'}</>,
                            },
                        }}
                    >
                        <Row gutter={16}>
                            <Col lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label={<span style={{ textAlign: 'center' }}>Ảnh đại diện</span>}
                                    name="avatar"
                                    // valuePropName="fileList"
                                    // getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
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
                                                          name: dataInit?.fullName ?? '',
                                                          status: 'done',
                                                          url: `${dataInit?.avatar}`,
                                                      },
                                                  ]
                                                : []
                                        }
                                    >
                                        {/* {visibleUpload && fileList.length < 1 && (
                                            <div>
                                                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Tải lên</div>
                                            </div>
                                        )} */}
                                        <div>
                                            {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Tải lên</div>
                                        </div>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProFormText
                                    label="Tên ứng viên"
                                    name="fullName"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên ứng viên' }]}
                                    placeholder="Nhập tên ứng viên"
                                />
                            </Col>
                            <Col lg={6} md={6} sm={24} xs={24}>
                                <ProForm.Item
                                    name="role"
                                    label="Vai trò"
                                    rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                                >
                                    <DebounceSelect
                                        allowClear
                                        showSearch
                                        value={roles}
                                        placeholder="Chọn vai trò"
                                        fetchOptions={fetchRoleList}
                                        onChange={(newValue: any) => {
                                            setRoles(newValue as IApplicantSelect[]);
                                        }}
                                        style={{ width: '100%' }}
                                    />
                                </ProForm.Item>
                            </Col>
                            <Col lg={6} md={6} sm={24} xs={24}>
                                <ProFormSwitch
                                    label="Trạng thái"
                                    name="availableStatus"
                                    checkedChildren="BẬT"
                                    unCheckedChildren="TẮT"
                                    initialValue={dataInit?.availableStatus}
                                />
                            </Col>
                            <Col md={6} xs={24}>
                                <ProFormText
                                    label="Tên hiển thị"
                                    name="username"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </Col>
                            <Col md={6} xs={24}>
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
                            <Col lg={6} md={6} sm={24} xs={24}>
                                <ProFormSelect
                                    name="education"
                                    label="Học vấn"
                                    valueEnum={{
                                        COLLEGE: 'Cao đẳng',
                                        UNIVERSITY: 'Đại học',
                                        SCHOOL: 'THPT',
                                        ENGINEER: 'Kỹ sư',
                                    }}
                                    placeholder="Chọn học vấn"
                                    rules={[{ required: true, message: 'Vui lòng chọn học vấn!' }]}
                                />
                            </Col>
                            <Col lg={6} md={6} sm={24} xs={24}>
                                <ProFormSelect
                                    name="level"
                                    label="Trình độ"
                                    valueEnum={{
                                        FRESHER: 'Fresher',
                                        JUNIOR: 'Junior',
                                        SENIOR: 'Senior',
                                        INTERN: 'Intern',
                                        MIDDLE: 'Middle',
                                    }}
                                    placeholder="Chọn trình độ"
                                    rules={[{ required: true, message: 'Vui lòng chọn trình độ!' }]}
                                />
                            </Col>
                            <Col md={12} xs={24}>
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
                            <Col md={12} xs={24}>
                                <ProFormText
                                    label="Số điện thoại"
                                    name={['contact', 'phone']}
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                    placeholder="Nhập số điện thoại"
                                />
                            </Col>
                            <Col md={12} xs={24}>
                                <ProFormText
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                                    placeholder="Nhập địa chỉ"
                                />
                            </Col>
                            <Col lg={6} md={6} sm={24} xs={24}>
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
                            <Col lg={6} md={6} sm={24} xs={24}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Ngày sinh"
                                    name="dob"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </ModalForm>
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
            )}
        </>
    );
};

export default ModalApplicant;
