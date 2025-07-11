import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import { Button, Col, Form, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { callFetchAllSkill, callFetchRecruiter } from '../../config/api';
import { LOCATION_LIST } from '../../config/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SearchClient = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, _setSearchParams] = useSearchParams();
    const queryLocation = searchParams.get('location');
    const querySkills = searchParams.get('skills');
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
    }, [queryLocation, querySkills]);

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
                        value: item.name ? item.name.toUpperCase() : ('' as string),
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
                        value: item.fullName ? item.fullName.toUpperCase() : ('' as string),
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
            query = values.location?.length
                ? query + `&skills=${values?.skills?.join(',')}`
                : `skills=${values?.skills?.join(',')}`;
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
                    <h2> {t('title')}</h2>
                </Col>
                <Col lg={10} xs={24} md={24}>
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
                </Col>
                <Col lg={5} xs={24} md={8}>
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
                </Col>
                <Col lg={5} xs={24} md={8}>
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
                </Col>
                <Col lg={4} xs={24} md={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={() => form.submit()}>
                        {t('search')}
                    </Button>
                </Col>
            </Row>
        </ProForm>
    );
};

export default SearchClient;
