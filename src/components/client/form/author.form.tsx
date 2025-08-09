import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components';
import type { IRecruiter, ISelect } from '../../../types/backend';
import { Col, Form, Row, Upload, type UploadFile } from 'antd';
import { useTranslation } from 'react-i18next';
import { DebounceSelect } from '../../admin/debounce.select';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { fetchRoleList, getRoleName } from '../../../config/utils';
import QuillCustom from '../../quill.custom';

interface IProps {
    author: IRecruiter | null;
}

const AuthorForm = (props: IProps) => {
    const { author } = props;

    const [form] = Form.useForm();
    const { t, i18n } = useTranslation();
    const [roles, setRoles] = useState<ISelect[]>([]);
    const [description, setDescription] = useState<string>('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        dayjs.locale(i18n.language);
    }, [i18n.language]);

    useEffect(() => {
        if (author?.userId) {
            if (author.role) {
                setRoles([
                    {
                        label: getRoleName(author.role?.name),
                        value: author.role?.roleId,
                        key: author.role?.roleId,
                    },
                ]);
            }

            if (author.description) {
                setDescription(author.description);
            }

            if (author?.avatar) {
                const file: UploadFile = {
                    uid: '-1',
                    name: author.fullName,
                    status: 'done',
                    url: author.avatar,
                };
                setFileList([file]);
            } else {
                setFileList([]);
            }

            form.setFieldsValue({
                fullName: author.fullName,
                username: author.username,
                contact: author.contact,
                address: author.address,
            });
        } else {
            form.resetFields();
        }
    }, [author]);

    return (
        <ProForm form={form} submitter={false}>
            <Row gutter={16}>
                <Col lg={20} md={20} sm={24} xs={24}>
                    <Row gutter={16}>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText
                                label={t('name_recruiter')}
                                name="fullName"
                                placeholder={t('placeholder')}
                                rules={[{ required: true, message: t('notify.required') }]}
                                fieldProps={{
                                    readOnly: true,
                                    style: {
                                        backgroundColor: '#fff',
                                        border: '1px solid #d9d9d9',
                                        cursor: 'not-allowed',
                                    },
                                }}
                            />
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProForm.Item name="role" label={t('role')}>
                                <DebounceSelect
                                    disabled
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
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText
                                label={t('username')}
                                name="username"
                                placeholder={t('placeholder')}
                                rules={[{ required: true, message: t('notify.required') }]}
                                fieldProps={{
                                    readOnly: true,
                                    style: {
                                        backgroundColor: '#fff',
                                        border: '1px solid #d9d9d9',
                                        cursor: 'not-allowed',
                                    },
                                }}
                            />
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText
                                label={t('email')}
                                name={['contact', 'email']}
                                rules={[
                                    { required: true, message: t('notify.required') },
                                    { type: 'email', message: t('notify.email_match') },
                                ]}
                                placeholder={t('placeholder')}
                                fieldProps={{
                                    readOnly: true,
                                    style: {
                                        backgroundColor: '#fff',
                                        border: '1px solid #d9d9d9',
                                        cursor: 'not-allowed',
                                    },
                                }}
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
                            fileList={fileList}
                            disabled
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col md={10} xs={24}>
                    <ProFormText
                        label={t('tel')}
                        name={['contact', 'phone']}
                        placeholder={t('placeholder')}
                        rules={[{ required: true, message: t('notify.required') }]}
                        fieldProps={{
                            readOnly: true,
                            style: { backgroundColor: '#fff', border: '1px solid #d9d9d9', cursor: 'not-allowed' },
                        }}
                    />
                </Col>
                <Col md={10} xs={24}>
                    <ProFormText
                        label={t('address')}
                        name="address"
                        placeholder={t('placeholder')}
                        rules={[{ required: true, message: t('notify.required') }]}
                        fieldProps={{
                            readOnly: true,
                            style: { backgroundColor: '#fff', border: '1px solid #d9d9d9', cursor: 'not-allowed' },
                        }}
                    />
                </Col>
            </Row>
            <ProCard
                title={t('description')}
                headStyle={{ color: '#d81921' }}
                style={{ marginBottom: 20 }}
                headerBordered
                size="small"
                bordered
            >
                <Col span={24}>
                    <QuillCustom value={description} onChange={setDescription} readonly={true} />
                </Col>
            </ProCard>
        </ProForm>
    );
};

export default AuthorForm;
