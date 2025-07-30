import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ProForm, ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { Col, DatePicker, Form, message, notification, Row, Upload, type FormInstance } from 'antd';
import { EDUCATION_LIST, fetchRoleList, getRoleName, LEVEL_LIST } from '../../../config/utils';
import type { IFullUser, ISelect } from '../../../types/backend';
import { DebounceSelect } from '../../admin/debounce.select';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { callCreateApplicant, callUpdateApplicant } from '../../../config/api';
import { useTranslation } from 'react-i18next';

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
    setLoadingUpload?: (v: any) => void;
    onRole: boolean;
    reloadTable?: () => void;
}

const ApplicantForm = (props: IProps) => {
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
        setLoadingUpload,
        onRole,
        reloadTable,
    } = props;
    const [roles, setRoles] = useState<ISelect[]>([]);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        dayjs.locale(i18n.language);
    }, [i18n.language]);

    useEffect(() => {
        if (dataInit?.userId) {
            if (dataInit.role) {
                setRoles([
                    {
                        label: getRoleName(dataInit.role?.name),
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
        } else {
            form.resetFields();
        }
    }, [dataInit]);

    const onFinish = async (values: any) => {
        const { fullName, availableStatus, username, education, level, contact, address, gender, dob } = values;
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
            const res = await callUpdateApplicant(
                dataInit.userId as string,
                fullName,
                address,
                contact,
                dob,
                gender,
                !onRole ? dataInit.password : '12345678',
                username,
                availableStatus,
                education,
                level,
                !onRole
                    ? { roleId: dataInit.role?.roleId ?? '', name: '' }
                    : role
                    ? { roleId: role.roleId, name: role.name }
                    : undefined,
                fileList.length > 0 ? fileList[0].url : '',
            );
            if (res.data) {
                message.success(t('notify.success_update_applicant'));
                if (onClose) onClose(false);
                if (reloadTable) reloadTable();
            } else {
                notification.error({
                    message: t('notify.error'),
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
                { roleId: role.roleId, name: role.name },
                fileList.length > 0 ? fileList[0].url : '',
            );
            if (res.data) {
                message.success(t('notify.success_create_applicant'));
                if (onClose) onClose(false);
                if (reloadTable) reloadTable();
            } else {
                notification.error({
                    message: t('notify.error'),
                    description: res.message,
                });
            }
        }
        if (setVisibleUpload) setVisibleUpload(true);
        if (setFileList) setFileList([]);
        if (setLoadingUpload) setLoadingUpload(false);
    };

    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            submitter={{
                searchConfig: {
                    resetText: t('button.cancel'),
                    submitText: <>{dataInit?.userId ? t('button.update') : t('button.create')}</>,
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
        >
            <Row gutter={16}>
                <Col lg={20} md={20} sm={24} xs={24}>
                    <Row gutter={16}>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText label={t('name_applicant')} name="fullName" placeholder={t('placeholder')} />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProFormSwitch
                                label={t('status')}
                                name="availableStatus"
                                checkedChildren={t('button.active').toUpperCase()}
                                unCheckedChildren={t('button.inactive').toUpperCase()}
                                initialValue={false}
                            />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProForm.Item name="role" label={t('role')}>
                                <DebounceSelect
                                    disabled={onRole ? false : true}
                                    allowClear
                                    showSearch
                                    value={roles}
                                    placeholder={t('choose')}
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
                                <ProFormText label={t('username')} name="username" placeholder={t('placeholder')} />
                            </Col>
                        ) : (
                            <>
                                <Col lg={6} md={6} sm={24} xs={24}>
                                    <ProFormText label={t('username')} name="username" placeholder={t('placeholder')} />
                                </Col>
                                <Col lg={6} md={6} sm={24} xs={24}>
                                    <ProFormText
                                        disabled={dataInit?.userId ? true : false}
                                        label={t('password')}
                                        name="password"
                                        rules={[
                                            () => ({
                                                validator(_, value) {
                                                    if (!dataInit?.userId && !value) {
                                                        return Promise.reject(t('notify.required'));
                                                    }
                                                    return Promise.resolve();
                                                },
                                            }),
                                        ]}
                                        placeholder={t('placeholder')}
                                    />
                                </Col>
                            </>
                        )}
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProFormSelect
                                name="education"
                                label={t('education')}
                                options={EDUCATION_LIST}
                                placeholder={t('choose')}
                            />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>
                            <ProFormSelect
                                name="level"
                                label={t('level')}
                                options={LEVEL_LIST}
                                placeholder={t('placeholder')}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col lg={4} md={4} sm={24} xs={24}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label={<span style={{ textAlign: 'center' }}>{t('avatar')}</span>}
                        name="avatar"
                    >
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            maxCount={1}
                            multiple={false}
                            customRequest={uploadFileLogo}
                            beforeUpload={beforeUpload}
                            onChange={onChange}
                            onRemove={(file) => removeFile(file)}
                            onPreview={onPreview}
                            fileList={fileList}
                        >
                            {visibleUpload && fileList.length < 1 && (
                                <div>
                                    {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>{t('upload')}</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col md={10} xs={24}>
                    <ProFormText
                        label={t('email')}
                        name={['contact', 'email']}
                        rules={[
                            { required: true, message: t('notify.required') },
                            { type: 'email', message: t('notify.email_match') },
                        ]}
                        placeholder={t('placeholder')}
                    />
                </Col>
                <Col md={10} xs={24}>
                    <ProFormText label={t('tel')} name={['contact', 'phone']} placeholder={t('placeholder')} />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col md={10} xs={24}>
                    <ProFormText label={t('address')} name="address" placeholder={t('placeholder')} />
                </Col>
                <Col lg={5} md={5} sm={24} xs={24}>
                    <ProFormSelect
                        name="gender"
                        label={t('gender')}
                        valueEnum={{
                            MALE: 'Nam',
                            FEMALE: 'Nữ',
                            OTHER: 'Khác',
                        }}
                        placeholder={t('choose')}
                        rules={[{ required: true, message: t('notify.required') }]}
                    />
                </Col>
                <Col lg={5} md={5} sm={24} xs={24}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label={t('dob')}
                        name="dob"
                        rules={[{ required: true, message: t('notify.required') }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                </Col>
            </Row>
        </ProForm>
    );
};

export default ApplicantForm;
