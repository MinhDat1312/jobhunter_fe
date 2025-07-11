import { MonitorOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Grid, Row, Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import useFollowRecruiter from '../../../hooks/useFollowRecruiter';
import { callFetchRecruiter } from '../../../config/api';

const { useBreakpoint } = Grid;
const { Title, Paragraph } = Typography;

const RecruiterSubscription = () => {
    const { t } = useTranslation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;

    const [form] = Form.useForm();
    const { followRecruiter, toggleFollowList } = useFollowRecruiter();
    const [optionsRecruiters, setOptionsRecruiters] = useState<
        {
            label: string;
            value: string;
        }[]
    >([]);

    useEffect(() => {
        const init = async () => {
            await fetchRecruiters();
        };

        init();
    }, []);

    useEffect(() => {
        const init = async () => {
            const arr = Object.entries(followRecruiter).map(([id]) => {
                return {
                    value: id,
                };
            });
            form.setFieldValue('recruiters', arr);
        };

        init();
    }, [followRecruiter]);

    const fetchRecruiters = async () => {
        let query = `page=1&size=500&sort=createdAt,desc`;
        const res = await callFetchRecruiter(query);
        if (res && res.data) {
            const arr =
                res?.data?.result?.map((item) => {
                    return {
                        label: item.fullName as string,
                        value: (item.userId + '') as string,
                    };
                }) ?? [];
            setOptionsRecruiters(arr);
        }
    };

    const onFinish = async (values: any) => {
        const { recruiters } = values;
        let arrRecruiter = null;

        if (typeof recruiters[0] === 'object') {
            arrRecruiter = recruiters.map((recruiter: any) => {
                return +recruiter.value;
            });
        } else {
            arrRecruiter = recruiters.map((recruiter: any) => {
                return +recruiter;
            });
        }

        toggleFollowList(arrRecruiter);
    };

    return (
        <Card
            style={{
                minHeight: 180,
                marginBlock: '32px',
                marginRight: isMobile || isTablet ? '0px' : '100px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Form onFinish={onFinish} form={form}>
                <Row>
                    <Col>
                        <Title level={3} style={{ fontWeight: 'bold' }}>
                            {t('recruiter_subscribed')}
                        </Title>
                        <Paragraph style={{ fontSize: '1rem', color: '#00b452', marginBottom: '12px' }}>
                            {t('recruiter_subscribed_desc')}
                        </Paragraph>
                    </Col>
                </Row>
                <Row gutter={[20, 0]}>
                    <Col xs={24} md={20} lg={20}>
                        <Form.Item name={'recruiters'}>
                            <Select
                                mode="multiple"
                                allowClear
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <MonitorOutlined /> {t('search_recruiter')}
                                    </>
                                }
                                maxTagCount={5}
                                maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
                                optionLabelProp="label"
                                options={optionsRecruiters}
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={4} lg={4}>
                        <Button className="btn-main" style={{ width: '100%' }} onClick={() => form.submit()}>
                            {t('button.follow')}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export default RecruiterSubscription;
