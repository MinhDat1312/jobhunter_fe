import { Button, Card, Col, Form, message, notification, Row, Select, Grid } from 'antd';
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

const { useBreakpoint } = Grid;

const SubscriptionEmail = () => {
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

    const [form] = Form.useForm();

    useEffect(() => {
        const init = async () => {
            await fetchSkill();
            const res = await callGetSubscriberSkills();
            if (res && res.data) {
                setSubscriber(res.data);
                const d = res.data.skills;
                const arr = d.map((item: any) => {
                    return {
                        label: item.name as string,
                        value: (item.skillId + '') as string,
                    };
                });
                form.setFieldValue('skills', arr);
            }
        };

        init();
    }, []);

    const fetchSkill = async () => {
        let query = `page=1&size=100&sort=createdAt,desc`;
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
                message.success('Cập nhật thông tin thành công');
                setSubscriber(res.data);
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        } else {
            const res = await callUpdateSubscriber({
                subscriberId: subscriber?.subscriberId,
                skills: arr,
            });
            if (res.data) {
                message.success('Cập nhật thông tin thành công');
                setSubscriber(res.data);
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        }
    };

    return (
        <Access permission={ALL_PERMISSIONS.SKILLS.GET_PAGINATE}>
            <Card
                style={{
                    minHeight: 180,
                    marginBlock: '32px',
                    marginRight: isMobile || isTablet ? '0px' : '100px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Form onFinish={onFinish} form={form}>
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <Form.Item
                                label={t('skill')}
                                name={'skills'}
                                rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}
                            >
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
                                    maxTagCount={5}
                                    maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
                                    optionLabelProp="label"
                                    options={optionsSkills}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Button onClick={() => form.submit()}>{t('button.update')}</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Access>
    );
};

export default SubscriptionEmail;
