import { MonitorOutlined, UserOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { callFetchRecruiter } from '../../../config/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SearchBlog = () => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [searchParams, _setSearchParams] = useSearchParams();
    const queryTitle = searchParams.get('title');
    const queryAuthors = searchParams.get('authors');
    const navigate = useNavigate();
    const [optionAuthors, setOptionAuthors] = useState<
        {
            label: string;
            value: string;
        }[]
    >([]);

    useEffect(() => {
        if (queryTitle) {
            form.setFieldValue('title', queryTitle);
        }
        if (queryAuthors) {
            form.setFieldValue('authors', queryAuthors.split(','));
        }
    }, [queryTitle, queryAuthors]);

    useEffect(() => {
        const fetchAuthors = async () => {
            let query = `page=1&size=500&sort=createdAt,desc`;

            const res = await callFetchRecruiter(query);
            if (res && res.data) {
                const arr =
                    res?.data?.result?.map((item) => {
                        return {
                            label: item.fullName as string,
                            value: item.fullName ? item.fullName : ('' as string),
                        };
                    }) ?? [];
                setOptionAuthors(arr);
            }
        };

        fetchAuthors();
    }, []);

    const onFinish = async (values: any) => {
        const { title, authors } = values;
        let query = '';

        if (title) {
            query = `title=${title}`;
        }
        if (authors?.length) {
            query = query.length === 0 ? `authors=${authors?.join(',')}` : query + `&authors=${authors?.join(',')}`;
        }

        navigate(`/blog?${query}`);
    };

    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            submitter={{
                render: () => <></>,
            }}
        >
            <Row gutter={[20, 0]}>
                <Col lg={12} xs={24} md={12}>
                    <motion.div
                        initial={{ scale: 0.5 }}
                        whileInView={{ scale: 1 }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeOut',
                        }}
                    >
                        <ProForm.Item name="title">
                            <Input placeholder={t('search_blog')} allowClear prefix={<MonitorOutlined />} />
                        </ProForm.Item>
                    </motion.div>
                </Col>
                <Col lg={8} xs={24} md={8}>
                    <motion.div
                        initial={{ scale: 0.5 }}
                        whileInView={{ scale: 1 }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeOut',
                        }}
                    >
                        <ProForm.Item name="authors">
                            <Select
                                mode="multiple"
                                allowClear
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <UserOutlined /> {t('search_author')}
                                    </>
                                }
                                maxTagCount={2}
                                maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
                                optionLabelProp="label"
                                options={optionAuthors}
                            />
                        </ProForm.Item>
                    </motion.div>
                </Col>
                <Col lg={4} xs={24} md={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <motion.div
                        initial={{ scale: 0.5 }}
                        whileInView={{ scale: 1 }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeOut',
                        }}
                    >
                        <Button type="primary" onClick={() => form.submit()}>
                            {t('search')}
                        </Button>
                    </motion.div>
                </Col>
            </Row>
        </ProForm>
    );
};

export default SearchBlog;
