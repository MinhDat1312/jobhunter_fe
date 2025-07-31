import { motion } from 'motion/react';
import Access from '../../share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import styles from '../../../styles/admin.module.scss';
import {
    Breadcrumb,
    Button,
    Col,
    ConfigProvider,
    Form,
    message,
    notification,
    Row,
    Upload,
    type UploadFile,
} from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import type { IBlog } from '../../../types/backend';
import {
    callCreateBlog,
    callFetchBlogById,
    callFetchTag,
    callUpdateBlog,
    callUploadSingleFile,
} from '../../../config/api';
import viVN from 'antd/lib/locale/vi_VN';
import {
    ProCard,
    ProForm,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import useUploadFile from '../../../hooks/useUploadFile';
import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import QuillCustom from '../../quill.custom';

const ViewUpsertBlog = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const blogId = params?.get('id');

    const [dataUpdate, setDataUpdate] = useState<IBlog | null>(null);
    const [content, setContent] = useState<string[]>([]);
    const [tags, setTags] = useState<{ label: string; value: string }[]>([]);
    const [form] = Form.useForm();
    const {
        fileList,
        loadingUpload,
        visibleUpload,
        setFileList,
        setLoadingUpload,
        handleRemoveFile,
        beforeUpload,
        handleChange,
        handleUploadFile,
    } = useUploadFile((file) => callUploadSingleFile(file, 'banners'));

    useEffect(() => {
        const init = async () => {
            const res = await callFetchTag('');
            if (res && res.data) {
                const tagOptions = res.data.map((tag) => ({
                    label: tag,
                    value: tag,
                }));
                setTags(tagOptions);
            }
        };

        init();
    }, []);

    useEffect(() => {
        const init = async () => {
            if (blogId) {
                const res = await callFetchBlogById(blogId);
                if (res && res.data) {
                    setDataUpdate(res.data);
                }
            }
        };

        init();
    }, [blogId]);

    useEffect(() => {
        if (dataUpdate) {
            if (dataUpdate?.banner) {
                const file: UploadFile = {
                    uid: '-1',
                    name: dataUpdate.title,
                    status: 'done',
                    url: dataUpdate.banner,
                };
                setFileList([file]);
                form.setFieldsValue({ banner: [file] });
            } else {
                setFileList([]);
            }
            setContent(dataUpdate.content ?? '');
            form.setFieldsValue({
                title: dataUpdate.title,
                description: dataUpdate.description,
                tags: dataUpdate.tags,
                draft: dataUpdate.draft,
            });
        } else {
            form.resetFields();
        }
    }, [dataUpdate]);

    const onFinish = async (values: any) => {
        if (content.length === 0) {
            message.error(t('notify.required') + ' ' + t('content'));
            return;
        }

        const processedContent = await Promise.all(content.map(async (html) => await replaceBase64WithUrls(html)));
        const blog = {
            title: values.title as string,
            banner: fileList[0].url as string,
            description: values.description as string,
            content: processedContent,
            tags: values.tags as string[],
            draft: values.draft ? true : false,
        };

        if (dataUpdate?.blogId) {
            const res = await callUpdateBlog(blog, dataUpdate.blogId);
            if (res.data) {
                message.success(t('notify.success_update_blog'));
                navigate('/admin/blog');
            } else {
                notification.error({
                    message: t('notify.error'),
                    description: res.message,
                });
            }
        } else {
            const res = await callCreateBlog(blog);
            if (res.data) {
                message.success(t('notify.success_create_blog'));
                navigate('/admin/blog');
            } else {
                notification.error({
                    message: t('notify.error'),
                    description: res.message,
                });
            }
        }
    };

    const replaceBase64WithUrls = async (html: string): Promise<string> => {
        const imgTagRegex = /<img[^>]+src="([^">]+)"/g;
        const matches = [...html.matchAll(imgTagRegex)];

        let updatedHTML = html;

        for (const match of matches) {
            const base64 = match[1];
            if (!base64.startsWith('data:image')) continue;

            const res = await fetch(base64);
            const blob = await res.blob();
            const file = new File([blob], 'image.png', { type: blob.type });

            try {
                const response = await callUploadSingleFile(file, 'content');
                const url = response?.data?.url;
                updatedHTML = updatedHTML.replace(base64, url ?? '');
            } catch (error) {
                message.error('Upload image failed');
            }
        }

        return updatedHTML;
    };

    const onClose = () => {
        form.resetFields();
        setFileList([]);
        setLoadingUpload(false);
        setContent([]);
    };

    const onChange = (index: number, value: string) => {
        const newContents = [...content];
        newContents[index] = value;
        setContent(newContents);
    };

    const onRemove = (index: number) => {
        const newContents = [...content];
        newContents.splice(index, 1);
        setContent(newContents);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 500 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Access permission={ALL_PERMISSIONS.BLOGS.CREATE}>
                <div className={styles['upsert-blog-container']}>
                    <div className={styles['title']}>
                        <Breadcrumb
                            separator=">"
                            items={[
                                {
                                    title: <Link to="/admin/blog">{t('blog')}</Link>,
                                },
                                {
                                    title: (
                                        <span style={{ color: '#00b452' }}>
                                            {dataUpdate?.blogId ? t('button.update') : t('button.create')}
                                        </span>
                                    ),
                                },
                            ]}
                        />
                    </div>
                    <div>
                        <ConfigProvider locale={viVN}>
                            <ProForm
                                form={form}
                                onFinish={onFinish}
                                submitter={{
                                    searchConfig: {
                                        resetText: t('button.cancel'),
                                        submitText: <>{dataUpdate?.blogId ? t('button.update') : t('button.create')}</>,
                                    },
                                    resetButtonProps: {
                                        preventDefault: true,
                                        onClick: onClose,
                                    },
                                    render: (_: any, dom: any) => (
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>{dom}</div>
                                    ),
                                    submitButtonProps: {
                                        icon: <CheckSquareOutlined />,
                                    },
                                }}
                            >
                                <Row>
                                    <Col span={24}>
                                        <ProFormSwitch
                                            label={t('status')}
                                            name="draft"
                                            checkedChildren={t('table.blog_table.draft').toUpperCase()}
                                            unCheckedChildren={t('table.blog_table.publish').toUpperCase()}
                                            initialValue={dataUpdate?.draft}
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <ProForm.Item
                                            labelCol={{ span: 24 }}
                                            label={<span style={{ textAlign: 'center' }}>{t('banner')}</span>}
                                            name="banner"
                                            rules={[{ required: true, message: t('notify.required') }]}
                                            valuePropName="fileList"
                                            getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
                                        >
                                            <Upload
                                                name="banner"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                style={{ width: '100%' }}
                                                maxCount={1}
                                                multiple={false}
                                                customRequest={handleUploadFile}
                                                beforeUpload={beforeUpload}
                                                onChange={handleChange}
                                                onRemove={(file) => handleRemoveFile(file)}
                                                fileList={fileList}
                                            >
                                                {visibleUpload && fileList.length < 1 && (
                                                    <div>
                                                        {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                                        <div style={{ marginTop: 8 }}>{t('upload')}</div>
                                                    </div>
                                                )}
                                            </Upload>
                                        </ProForm.Item>
                                    </Col>
                                    <Col span={24}>
                                        <ProFormText
                                            name="title"
                                            label={
                                                <span style={{ textAlign: 'center' }}>
                                                    {t('table.blog_table.title')}
                                                </span>
                                            }
                                            placeholder={t('placeholder')}
                                            rules={[{ required: true, message: t('notify.required') }]}
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <ProFormTextArea
                                            name="description"
                                            label={<span style={{ textAlign: 'center' }}>{t('description')}</span>}
                                            placeholder={t('placeholder')}
                                            rules={[{ required: true, message: t('notify.required') }]}
                                            fieldProps={{
                                                rows: 6,
                                                style: { resize: 'none' },
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <ProCard
                                    title={
                                        <span>
                                            <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                                            {t('content')}
                                        </span>
                                    }
                                    headStyle={{ color: '#d81921' }}
                                    bodyStyle={{ padding: 0 }}
                                    style={{
                                        marginBottom: 20,
                                    }}
                                    headerBordered
                                    size="small"
                                    bordered
                                >
                                    <div
                                        style={{
                                            maxHeight: 430,
                                            overflowY: 'auto',
                                            padding: 12,
                                        }}
                                    >
                                        {content.map((item, index) => (
                                            <Col span={24} key={index}>
                                                <QuillCustom
                                                    value={item}
                                                    index={index}
                                                    onChange={onChange}
                                                    onRemove={onRemove}
                                                />
                                            </Col>
                                        ))}
                                    </div>
                                    <Button
                                        style={{ margin: '0 0 12px 12px' }}
                                        onClick={() => setContent([...content, ''])}
                                    >
                                        <PlusOutlined />
                                    </Button>
                                </ProCard>
                                <Row>
                                    <Col span={24}>
                                        <ProFormSelect
                                            mode="tags"
                                            name="tags"
                                            label={t('topic')}
                                            options={tags}
                                            placeholder={t('placeholder')}
                                            fieldProps={{
                                                tokenSeparators: [','],
                                            }}
                                            rules={[{ required: true, message: t('notify.required') }]}
                                        />
                                    </Col>
                                </Row>
                            </ProForm>
                        </ConfigProvider>
                    </div>
                </div>
            </Access>
        </motion.div>
    );
};

export default ViewUpsertBlog;
