import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import { Button, Col, Form, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { callFetchAllSkill, callFetchRecruiter } from '../../config/api';
import { LOCATION_LIST } from '../../config/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

const SearchClient = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, _setSearchParams] = useSearchParams();
    const queryLocation = searchParams.get('location');
    const querySkills = searchParams.get('skills');
    const queryRecruiters = searchParams.get('recruiters');
    const [form] = Form.useForm();
    const optionsLocations = LOCATION_LIST;
    const [optionsSkills, setOptionsSkills] = useState<
        {
            label: string;
            value: string;
        }[]
    >([]);
    const [optionsRecruiters, setOptionsRecruiters] = useState<
        {
            label: string;
            value: string;
        }[]
    >([]);

    useEffect(() => {
        if (queryLocation) {
            form.setFieldValue('location', queryLocation.split(','));
        }
        if (querySkills) {
            form.setFieldValue('skills', querySkills.split(','));
        }
        if (queryRecruiters) {
            form.setFieldValue('recruiters', queryRecruiters.split(','));
        }
    }, [queryLocation, querySkills, queryRecruiters]);

    useEffect(() => {
        fetchSkills();
        fetchRecruiters();
    }, []);

    const fetchSkills = async () => {
        let query = `page=1&size=500&sort=createdAt,desc`;

        const res = await callFetchAllSkill(query);
        if (res && res.data) {
            const arr =
                res?.data?.result?.map((item) => {
                    return {
                        label: item.name as string,
                        value: item.name ? item.name : ('' as string),
                    };
                }) ?? [];
            setOptionsSkills(arr);
        }
    };

    const fetchRecruiters = async () => {
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
            setOptionsRecruiters(arr);
        }
    };

    const onFinish = async (values: any) => {
        let query = '';

        if (values?.location?.length) {
            query = `location=${values?.location?.join(',')}`;
        }
        if (values?.skills?.length) {
            query =
                query.length === 0
                    ? `skills=${values?.skills?.join(',')}`
                    : query + `&skills=${values?.skills?.join(',')}`;
        }
        if (values?.recruiters?.length) {
            query =
                query.length === 0
                    ? `recruiters=${values?.recruiters?.join(',')}`
                    : query + `&recruiters=${values?.recruiters?.join(',')}`;
        }

        navigate(`/job?${query}`);
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
                <Col span={24} style={{ marginBottom: '12px' }}>
                    <motion.h2
                        initial={{ y: -100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1, color: '#00b452' }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeOut',
                        }}
                        style={{ fontSize: '1.5rem' }}
                    >
                        {t('title')}
                    </motion.h2>
                </Col>
                <Col lg={10} xs={24} md={24}>
                    <motion.div
                        initial={{ scale: 0.5 }}
                        whileInView={{ scale: 1 }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeOut',
                        }}
                    >
                        <ProForm.Item name="skills">
                            <Select
                                mode="multiple"
                                allowClear
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <MonitorOutlined /> {t('search_skill')}
                                    </>
                                }
                                maxTagCount={3}
                                maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
                                optionLabelProp="label"
                                options={optionsSkills}
                            />
                        </ProForm.Item>
                    </motion.div>
                </Col>
                <Col lg={5} xs={24} md={8}>
                    <motion.div
                        initial={{ scale: 0.5 }}
                        whileInView={{ scale: 1 }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeOut',
                        }}
                    >
                        <ProForm.Item name="location">
                            <Select
                                mode="multiple"
                                allowClear
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <EnvironmentOutlined /> {t('search_location')}
                                    </>
                                }
                                maxTagCount={2}
                                maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
                                optionLabelProp="label"
                                options={optionsLocations}
                            />
                        </ProForm.Item>
                    </motion.div>
                </Col>
                <Col lg={5} xs={24} md={8}>
                    <motion.div
                        initial={{ scale: 0.5 }}
                        whileInView={{ scale: 1 }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeOut',
                        }}
                    >
                        <ProForm.Item name="recruiters">
                            <Select
                                mode="multiple"
                                allowClear
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <EnvironmentOutlined /> {t('search_recruiter')}
                                    </>
                                }
                                maxTagCount={2}
                                maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
                                optionLabelProp="label"
                                options={optionsRecruiters}
                            />
                        </ProForm.Item>
                    </motion.div>
                </Col>
                <Col lg={4} xs={24} md={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
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

export default SearchClient;
