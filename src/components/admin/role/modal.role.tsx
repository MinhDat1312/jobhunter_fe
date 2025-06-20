import { Col, Form, message, notification, Row } from 'antd';
import type { IPermission, IRole } from '../../../types/backend';
import {
    FooterToolbar,
    ModalForm,
    ProCard,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { isMobile } from 'react-device-detect';
import { CheckSquareOutlined } from '@ant-design/icons';
import ModuleApi from './module.api';
import { callCreateRole, callUpdateRole } from '../../../config/api';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
    listPermissions: {
        module: string;
        permissions: IPermission[];
    }[];
    singleRole: IRole | null;
    setSingleRole: (v: any) => void;
}

const ModalRole = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, listPermissions, singleRole, setSingleRole } = props;
    const [form] = Form.useForm();

    const submitRole = async (valuesForm: any) => {
        const { description, active, name, permissions } = valuesForm;
        const checkedPermissions = [];

        if (permissions) {
            for (const key in permissions) {
                if (key.match(/^[1-9][0-9]*$/) && permissions[key] === true) {
                    checkedPermissions.push({ permissionId: key });
                }
            }
        }

        if (singleRole?.roleId) {
            const role = {
                name,
                description,
                active,
                permissions: checkedPermissions,
            };
            const res = await callUpdateRole(role, singleRole.roleId);
            if (res.data) {
                message.success('Cập nhật vai trò thành công');
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        } else {
            const role = {
                name,
                description,
                active,
                permissions: checkedPermissions,
            };
            const res = await callCreateRole(role);
            if (res.data) {
                message.success('Thêm mới vai trò thành công');
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
        setOpenModal(false);
        setSingleRole(null);
    };

    return (
        <>
            <ModalForm
                title={<>{singleRole?.roleId ? 'Cập nhật vai trò' : 'Tạo mới vai trò'}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => {
                        handleReset();
                    },
                    afterClose: () => handleReset(),
                    destroyOnHidden: true,
                    width: isMobile ? '100%' : 900,
                    keyboard: false,
                    maskClosable: false,
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitRole}
                submitter={{
                    render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                    submitButtonProps: {
                        icon: <CheckSquareOutlined />,
                    },
                    searchConfig: {
                        resetText: 'Hủy',
                        submitText: <>{singleRole?.roleId ? 'Cập nhật' : 'Tạo mới'}</>,
                    },
                }}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên vai trò"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSwitch
                            label="Trạng thái"
                            name="active"
                            checkedChildren="BẬT"
                            unCheckedChildren="TẮT"
                            initialValue={singleRole?.roleId ? true : false}
                        />
                    </Col>
                    <Col span={24}>
                        <ProFormTextArea
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập mô tả vai trò"
                            fieldProps={{
                                autoSize: { minRows: 2 },
                            }}
                        />
                    </Col>
                    <Col span={24}>
                        <ProCard
                            title="Quyền hạn"
                            subTitle="Các quyền hạn được phép cho vai trò này"
                            headStyle={{ color: '#d81921' }}
                            style={{ marginBottom: 20 }}
                            headerBordered
                            size="small"
                            bordered
                        >
                            <ModuleApi
                                form={form}
                                listPermissions={listPermissions}
                                singleRole={singleRole}
                                openModal={openModal}
                            />
                        </ProCard>
                    </Col>
                </Row>
            </ModalForm>
        </>
    );
};

export default ModalRole;
