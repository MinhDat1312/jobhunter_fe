import { Col, Form, message, notification, Row } from 'antd';
import type { IPermission, IRole } from '../../../types/backend';
import { ModalForm, ProCard, ProFormSwitch, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { isMobile } from 'react-device-detect';
import { CheckSquareOutlined } from '@ant-design/icons';
import ModuleApi from './module.api';
import { callCreateRole, callUpdateRole } from '../../../config/api';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
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
                message.success(t('notify.success_update_role'));
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: t('notify.error'),
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
                message.success(t('notify.success_create_role'));
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: t('notify.error'),
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
                title={
                    <>
                        {singleRole?.roleId
                            ? t('button.update') + ' ' + t('role').toLowerCase()
                            : t('button.create') + ' ' + t('role').toLowerCase()}
                    </>
                }
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
                    render: (_: any, dom: any) => (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>{dom}</div>
                    ),
                    submitButtonProps: {
                        icon: <CheckSquareOutlined />,
                    },
                    searchConfig: {
                        resetText: t('button.cancel'),
                        submitText: <>{singleRole?.roleId ? t('button.update') : t('button.create')}</>,
                    },
                }}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label={t('name_role')}
                            name="name"
                            rules={[{ required: true, message: t('notify.required') }]}
                            placeholder={t('placeholder')}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSwitch
                            label={t('status')}
                            name="active"
                            checkedChildren={t('button.active').toUpperCase()}
                            unCheckedChildren={t('button.inactive').toUpperCase()}
                            initialValue={singleRole?.roleId ? true : false}
                        />
                    </Col>
                    <Col span={24}>
                        <ProFormTextArea
                            label={t('description')}
                            name="description"
                            rules={[{ required: true, message: t('notify.required') }]}
                            placeholder={t('placeholder')}
                            fieldProps={{
                                autoSize: { minRows: 2 },
                            }}
                        />
                    </Col>
                    <Col span={24}>
                        <ProCard
                            title={t('permission')}
                            subTitle={t('title_permission')}
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
