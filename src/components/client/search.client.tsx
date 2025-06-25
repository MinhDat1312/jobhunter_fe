import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import { Button, Col, Form, notification, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { callFetchAllSkill } from '../../config/api';
import { LOCATION_LIST } from '../../config/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SearchClient = () => {
    const navigate = useNavigate();
    const [searchParams, _setSearchParams] = useSearchParams();
    const queryLocation = searchParams.get('location');
    const querySkills = searchParams.get('skills');

    const optionsLocations = LOCATION_LIST;
    const [form] = Form.useForm();

    const [optionsSkills, setOptionsSkills] = useState<
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
        const fetchSkill = async () => {
            let query = `page=1&size=100&sort=createdAt,desc`;

            const res = await callFetchAllSkill(query);
            if (res && res.data) {
                const arr =
                    res?.data?.result?.map((item) => {
                        return {
                            label: item.name as string,
                            value: item.name ? item.name.toUpperCase() : '' as string,
                        };
                    }) ?? [];
                setOptionsSkills(arr);
            }
        };

        fetchSkill();
    }, []);

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

        if (!query) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Vui lòng chọn tiêu chí để tìm kiếm',
            });
            return;
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
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <h2>Việc Làm Cho Vất Vả "Chất"</h2>
                </Col>
                <Col span={24} md={13}>
                    <ProForm.Item name="skills">
                        <Select
                            mode="multiple"
                            allowClear
                            suffixIcon={null}
                            style={{ width: '100%' }}
                            placeholder={
                                <>
                                    <MonitorOutlined /> Tìm theo kỹ năng...
                                </>
                            }
                            maxTagCount={7}
                            maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} kỹ năng`}
                            optionLabelProp="label"
                            options={optionsSkills}
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={7}>
                    <ProForm.Item name="location">
                        <Select
                            mode="multiple"
                            allowClear
                            suffixIcon={null}
                            style={{ width: '100%' }}
                            placeholder={
                                <>
                                    <EnvironmentOutlined /> Địa điểm...
                                </>
                            }
                            maxTagCount={2}
                            maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} địa điểm`}
                            optionLabelProp="label"
                            options={optionsLocations}
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={4}>
                    <Button type="primary" onClick={() => form.submit()}>
                        Tìm kiếm
                    </Button>
                </Col>
            </Row>
        </ProForm>
    );
};

export default SearchClient;
