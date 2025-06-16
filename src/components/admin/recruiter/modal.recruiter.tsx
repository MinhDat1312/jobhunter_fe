import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { FooterToolbar, ModalForm, ProCard, ProFormText } from '@ant-design/pro-components';
import { Col, ConfigProvider, Form, Modal, Row, Upload, message, notification } from 'antd';
import '../../../styles/reset.scss';
import { isMobile } from 'react-device-detect';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { callCreateRecruiter, callUpdateRecruiter, callUploadSingleFile } from '../../../config/api';
import { v4 as uuidv4 } from 'uuid';
import vi_VN from 'antd/locale/vi_VN';
import type { Address, Contact, IRecruiter } from '../../../types/backend';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IRecruiter | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface IRecruiterForm {
    fullName: string;
    password: string;
    username: string;
    contact: Contact;
    address: Address;
}

interface IRecruiterLogo {
    uid: string;
    name: string;
}

const ModalRecruiter = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    const [animation, setAnimation] = useState<string>('open');

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [dataLogo, setDataLogo] = useState<IRecruiterLogo[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [value, setValue] = useState<string>('');
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.userId && dataInit?.description) {
            setValue(dataInit.description);
        }
        if (dataInit?.userId && dataInit?.logo) {
            setDataLogo([{ name: dataInit?.logo, uid: uuidv4() }]);
        }
    }, [dataInit]);

    const submitRecruiter = async (valuesForm: IRecruiterForm) => {
        const { fullName, username, contact, address } = valuesForm;
        let { password } = valuesForm;

        if (dataLogo.length === 0) {
            message.error('Vui lòng upload ảnh Logo');
            return;
        }

        if (dataInit?.userId) {
            password = "0123456789"
            const res = await callUpdateRecruiter(
                dataInit.userId,
                fullName,
                password,
                username,
                contact,
                address,
                value,
                dataLogo[0].name,
            );
            if (res.data) {
                message.success('Cập nhật company thành công');
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
                dataLogo[0].name,
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

        setAnimation('close');
        await new Promise((r) => setTimeout(r, 400));
        setOpenModal(false);
        setAnimation('open');
    };

    const handleRemoveFile = (file: any) => {
        setDataLogo([]);
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
        const res = await callUploadSingleFile(file, 'recruiters');
        if (res && res.data) {
            setDataLogo([
                {
                    name: res.data.fileName,
                    uid: uuidv4(),
                },
            ]);
            if (onSuccess) onSuccess('ok');
        } else {
            if (onError) {
                setDataLogo([]);
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };

    return (
        <>
            {openModal && (
                <>
                    <ModalForm
                        title={<>{dataInit?.userId ? 'Cập nhật Recruiter' : 'Tạo mới Recruiter'}</>}
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
                            rootClassName: `modal-company-root ${animation}`,
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
                            <Col span={12}>
                                <ProFormText
                                    label="Tên nhà tuyển dụng"
                                    name="fullName"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống tên nhà tuyển dụng' }]}
                                    placeholder="Nhập tên nhà tuyển dụng"
                                />
                            </Col>
                            <Col span={12}>
                                <ProFormText
                                    label="Tên đăng nhập"
                                    name="username"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống tên đăng nhập' }]}
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </Col>
                            {!dataInit?.userId && (
                                <Col span={12}>
                                    <ProFormText
                                        label="Mật khẩu"
                                        name="password"
                                        rules={[{ required: true, message: 'Vui lòng không bỏ trống mật khẩu' }]}
                                        placeholder="Nhập mật khẩu"
                                    />
                                </Col>
                            )}
                            <Col span={12}>
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
                            <Col span={12}>
                                <ProFormText
                                    label="Số điện thoại"
                                    name={['contact', 'phone']}
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống số điện thoại' }]}
                                    placeholder="Nhập số điện thoại"
                                />
                            </Col>
                            <Col span={8}>
                                <ProFormText label="Số nhà" name={['address', 'number']} placeholder="Nhập số nhà" />
                            </Col>
                            <Col span={8}>
                                <ProFormText
                                    label="Tên đường"
                                    name={['address', 'street']}
                                    placeholder="Nhập tên đường"
                                />
                            </Col>
                            <Col span={8}>
                                <ProFormText
                                    label="Phường/xã"
                                    name={['address', 'ward']}
                                    placeholder="Nhập phường/xã"
                                />
                            </Col>
                            <Col span={8}>
                                <ProFormText
                                    label="Quận/huyện"
                                    name={['address', 'district']}
                                    placeholder="Nhập quận/huyện"
                                />
                            </Col>
                            <Col span={8}>
                                <ProFormText
                                    label="Thành phố"
                                    name={['address', 'city']}
                                    placeholder="Nhập thành phố"
                                />
                            </Col>
                            <Col span={8}>
                                <ProFormText
                                    label="Quốc gia"
                                    name={['address', 'country']}
                                    placeholder="Nhập quốc gia"
                                />
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Ảnh Logo"
                                    name="logo"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng không bỏ trống',
                                            validator: () => {
                                                if (dataLogo.length > 0 || dataInit?.logo) return Promise.resolve();
                                                else return Promise.reject(false);
                                            },
                                        },
                                    ]}
                                >
                                    <ConfigProvider locale={vi_VN}>
                                        <Upload
                                            name="logo"
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
                                                dataInit?.userId && dataInit?.logo
                                                    ? [
                                                          {
                                                              uid: uuidv4(),
                                                              name: dataInit?.logo ?? '',
                                                              status: 'done',
                                                              url: `${
                                                                  import.meta.env.VITE_BACKEND_URL
                                                              }/storage/recruiters/${dataInit?.logo}`,
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
