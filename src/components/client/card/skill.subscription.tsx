import { Button, Card, Col, Form, message, notification, Row, Select, Grid, Typography } from 'antd';
import { useAppSelector } from '../../../hooks/hook';
import { useEffect, useState } from 'react';
import { MonitorOutlined } from '@ant-design/icons';
import type { ISubscriber } from '../../../types/backend';
import {
    callCreateSubscriber,
    callFetchAllSkill,
    callGetSubscriberSkills,
    callUpdateSubscriber,
} from '../../../config/api';
import Access from '../../share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import { useTranslation } from 'react-i18next';
import '../../../styles/client.module.scss';

const { useBreakpoint } = Grid;
const { Title, Paragraph } = Typography;

const SkillSubscription = () => {
    const { t } = useTranslation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;

    const user = useAppSelector((state) => state.account.user);
    const [optionsSkills, setOptionsSkills] = useState<
        {
            label: string;
            value: string;
        }[]
    >([]);
    const [subscriber, setSubscriber] = useState<ISubscriber | null>(null);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const [form] = Form.useForm();

    useEffect(() => {
        const init = async () => {
            await fetchSkills();
            const res = await callGetSubscriberSkills();
            if (res && res.data) {
                setSubscriber(res.data);
                const d = res.data.skills;
                const arr = d.map((item: any) => {
                    return {
                        value: (item.skillId + '') as string,
                    };
                });
                const selectedSkillIds = d.map((item: any) => {
                    return (item.skillId + '') as string;
                });
                form.setFieldValue('skills', arr);
                setSelectedSkills(selectedSkillIds);
            }
        };

        init();
    }, []);

    const fetchSkills = async () => {
        let query = `page=1&size=500&sort=createdAt,desc`;
        const res = await callFetchAllSkill(query);
        if (res && res.data) {
            const arr =
                res?.data?.result?.map((item) => {
                    return {
                        label: item.name as string,
                        value: (item.skillId + '') as string,
                    };
                }) ?? [];
            setOptionsSkills(arr);
        }
    };

    const onFinish = async (values: any) => {
        const { skills } = values;

        const arr = skills?.map((item: any) => {
            if (item?.value) return { skillId: item.value };
            return { skillId: item };
        });

        if (!subscriber?.subscriberId) {
            const data = {
                email: user.email,
                name: user.fullName,
                skills: arr,
            };

            const res = await callCreateSubscriber(data);
            if (res.data) {
                message.success(t('notify.success_update'));
                setSubscriber(res.data);
            } else {
                notification.error({
                    message: t('notify.error'),
                    description: res.message,
                });
            }
        } else {
            const res = await callUpdateSubscriber({
                subscriberId: subscriber?.subscriberId,
                skills: arr,
            });
            if (res.data) {
                message.success(t('notify.success_update'));
                setSubscriber(res.data);
            } else {
                notification.error({
                    message: t('notify.error'),
                    description: res.message,
                });
            }
        }
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
                            {t('skill_subscribed')} ({subscriber?.skills ? subscriber?.skills.length : 0}/5)
                        </Title>
                        <Paragraph style={{ fontSize: '1rem', color: '#00b452', marginBottom: '12px' }}>
                            {t('skill_subscribed_desc')}
                        </Paragraph>
                    </Col>
                </Row>
                <Row gutter={[20, 0]}>
                    <Col xs={24} md={20} lg={20}>
                        <Form.Item
                            name={'skills'}
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value && value.length <= 5
                                            ? Promise.resolve()
                                            : Promise.reject(new Error(t('notify.max_skill'))),
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                showSearch
                                allowClear
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <MonitorOutlined /> {t('search_skill')}
                                    </>
                                }
                                maxTagCount={5}
                                maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
                                optionLabelProp="label"
                                onChange={(values) => setSelectedSkills(values)}
                                options={optionsSkills.map((skill) => ({
                                    ...skill,
                                    disabled: selectedSkills.length >= 5 && !selectedSkills.includes(skill.value),
                                }))}
                                filterOption={(input, option) =>
                                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Access
                        permission={[ALL_PERMISSIONS.SUBSCRIBERS.CREATE, ALL_PERMISSIONS.SUBSCRIBERS.UPDATE]}
                        hideChildren
                    >
                        <Col xs={24} md={4} lg={4}>
                            <Button className="btn-main" style={{ width: '100%' }} onClick={() => form.submit()}>
                                {t('button.subscribe')}
                            </Button>
                        </Col>
                    </Access>
                </Row>
            </Form>
        </Card>
    );
};

export default SkillSubscription;
