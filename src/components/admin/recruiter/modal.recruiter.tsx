import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { FooterToolbar, ModalForm, ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import { Col, ConfigProvider, Form, Modal, Row, Upload, message, notification } from 'antd';
import '../../../styles/reset.scss';
import { isMobile } from 'react-device-detect';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { callCreateRecruiter, callFetchRole, callUpdateRecruiter, callUploadSingleFile } from '../../../config/api';
import { v4 as uuidv4 } from 'uuid';
import vi_VN from 'antd/locale/vi_VN';
import type { IRecruiter } from '../../../types/backend';
import { DebounceSelect } from '../debounce.select';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IRecruiter | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface IRecruiterAvatar {
    uid: string;
    name: string;
}

export interface IRecruiterSelect {
    label: string;
    value: string;
    key?: string;
}

const ModalRecruiter = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    const [animation, setAnimation] = useState<string>('open');
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [dataAvatar, setDataAvatar] = useState<IRecruiterAvatar[]>([]);
    const [roles, setRoles] = useState<IRecruiterSelect[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [value, setValue] = useState<string>('');
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
                setValue(dataInit.description);
            }
            if (dataInit.avatar) {
                setDataAvatar([{ name: dataInit?.avatar, uid: uuidv4() }]);
            }
        }
    }, [dataInit]);

    const submitRecruiter = async (valuesForm: any) => {
        const { fullName, username, contact, address } = valuesForm;
        let { role } = valuesForm;
        let { password } = valuesForm;

        if (dataAvatar.length === 0) {
            message.error('Vui lòng upload ảnh Logo');
            return;
        }

        if (typeof role === 'number') {
            role = {
                roleId: role,
                name: '',
            };
        }

        if (dataInit?.userId) {
            password = '0123456789';
            const res = await callUpdateRecruiter(
                dataInit.userId,
                fullName,
                password,
                username,
                contact,
                address,
                value,
                dataAvatar[0].name,
                role ? role : undefined,
            );
            if (res.data) {
                message.success('Cập nhật nhà tuyển dụng thành công');
                handleReset();
                reloadTable();
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
                value,
                dataAvatar[0].name,
                role ? role : undefined,
            );
            if (res.data) {
                message.success('Thêm mới nhà tuyển dụng thành công');
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
        setValue('');
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
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? 'Đã có lỗi xảy ra khi upload file.');
        }
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, 'recruiters');
        if (res && res.data) {
            setDataAvatar([
                {
                    name: res.data.fileName,
                    uid: uuidv4(),
                },
            ]);
            if (onSuccess) onSuccess('ok');
        } else {
            if (onError) {
                setDataAvatar([]);
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };

    async function fetchRoleList(name: string): Promise<IRecruiterSelect[]> {
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

    return (
        <>
            {openModal && (
                <>
                    <ModalForm
                        title={<>{dataInit?.userId ? 'Cập nhật nhà tuyển dụng' : 'Tạo mới nhà tuyển dụng'}</>}
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
                            className: `modal-recruiter ${animation}`,
                            rootClassName: `modal-recruiter-root ${animation}`,
                        }}
                        scrollToFirstError={true}
                        preserve={false}
                        form={form}
                        onFinish={submitRecruiter}
                        initialValues={dataInit?.userId ? dataInit : {}}
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
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProFormText
                                    label="Tên nhà tuyển dụng"
                                    name="fullName"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống tên nhà tuyển dụng' }]}
                                    placeholder="Nhập tên nhà tuyển dụng"
                                />
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={12}>
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
                                            setRoles(newValue as IRecruiterSelect[]);
                                        }}
                                        style={{ width: '100%' }}
                                    />
                                </ProForm.Item>
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProFormText
                                    label="Tên hiển thị"
                                    name="username"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống tên đăng nhập' }]}
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProFormText
                                    disabled={dataInit?.userId ? true : false}
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[
                                        () => ({
                                            validator(_, value) {
                                                if (!dataInit?.userId && !value) {
                                                    return Promise.reject('Vui lòng không bỏ trống mật khẩu');
                                                }
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                    placeholder="Nhập mật khẩu"
                                />
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProFormText
                                    label="Email"
                                    name={['contact', 'email']}
                                    rules={[
                                        { required: true, message: 'Vui lòng không bỏ trống email' },
                                        { type: 'email', message: 'Email không hợp lệ' },
                                    ]}
                                    placeholder="Nhập email"
                                />
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProFormText
                                    label="Số điện thoại"
                                    name={['contact', 'phone']}
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống số điện thoại' }]}
                                    placeholder="Nhập số điện thoại"
                                />
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProFormText
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống địa chỉ' }]}
                                    placeholder="Nhập địa chỉ"
                                />
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Ảnh Logo"
                                    name="avatar"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng không bỏ trống',
                                            validator: () => {
                                                if (dataAvatar.length > 0 || dataInit?.avatar) return Promise.resolve();
                                                else return Promise.reject(false);
                                            },
                                        },
                                    ]}
                                >
                                    <ConfigProvider locale={vi_VN}>
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
                                                              url: `${
                                                                  import.meta.env.VITE_BACKEND_URL
                                                              }/storage/recruiters/${dataInit?.avatar}`,
                                                          },
                                                      ]
                                                    : []
                                            }
                                        >
                                            <div>
                                                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    </ConfigProvider>
                                </Form.Item>
                            </Col>
                            <ProCard
                                title="Mô tả"
                                headStyle={{ color: '#d81921' }}
                                style={{ marginBottom: 20 }}
                                headerBordered
                                size="small"
                                bordered
                            >
                                <Col span={24}>
                                    <ReactQuill theme="snow" value={value} onChange={setValue} />
                                </Col>
                            </ProCard>
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
                </>
            )}
        </>
    );
};

export default ModalRecruiter;
