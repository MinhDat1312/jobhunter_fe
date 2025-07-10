import { Avatar, Button, Card, Col, Empty, Grid, Row, Space, Spin, Typography } from 'antd';
import useSaveJob from '../../../hooks/useSaveJob';
import { useEffect, useState } from 'react';
import type { IJob } from '../../../types/backend';
import { sfIn } from 'spring-filter-query-builder';
import { callFetchJob } from '../../../config/api';
import { useTranslation } from 'react-i18next';
import { convertSlug } from '../../../config/utils';
import { useNavigate } from 'react-router-dom';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import styles from '../../../styles/client.module.scss';
import dayjs from 'dayjs';
import Access from '../../share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import ApplyModal from '../modal/apply.modal';

const { useBreakpoint } = Grid;
const { Text } = Typography;

const SaveJob = () => {
    const { t, i18n } = useTranslation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;

    const navigate = useNavigate();
    const { saveJob, toggleSave } = useSaveJob();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [jobDetail, setJobDetail] = useState<IJob | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            setIsLoading(true);

            const jobIds = Object.entries(saveJob).map((jobId) => {
                return +jobId[0];
            });

            let query = ``;
            let q = sfIn('jobId', jobIds).toString();
            query += `filter=${encodeURIComponent(q)}`;

            const res = await callFetchJob(query);
            if (res && res.data) {
                setDisplayJob(res.data.result);
            }

            setIsLoading(false);
        };

        fetchJob();
    }, [saveJob]);

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.title);
        navigate(`/job/${slug}?id=${item.jobId}`);
    };

    return (
        <Card
            style={{
                marginBlock: '32px',
                marginRight: isMobile || isTablet ? '0px' : '100px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Spin spinning={isLoading} tip="Loading...">
                <div
                    style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        padding: '24px 8px',
                    }}
                >
                    <Row gutter={[12, 24]}>
                        {displayJob?.map((item) => {
                            return (
                                item.active && (
                                    <Col span={24} key={item.jobId}>
                                        <Card size="small" title={null} hoverable>
                                            <Row gutter={16} align="middle">
                                                <Col xs={8} md={4} lg={3}>
                                                    <Avatar
                                                        shape="square"
                                                        size={100}
                                                        src={item?.recruiter?.avatar}
                                                        alt="Recruiter Avatar"
                                                    />
                                                </Col>
                                                <Col xs={16} md={20} lg={21}>
                                                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                                        <Row
                                                            style={{
                                                                width: '100%',
                                                            }}
                                                        >
                                                            <Col xs={24} md={16} lg={16}>
                                                                <Text
                                                                    onClick={() => handleViewDetailJob(item)}
                                                                    className={styles['job-title']}
                                                                    style={{
                                                                        width: isMobile ? '200px' : '100%',
                                                                        fontSize: '1rem',
                                                                    }}
                                                                    ellipsis
                                                                >
                                                                    {item.title}
                                                                </Text>
                                                            </Col>
                                                            <Col
                                                                xs={24}
                                                                md={8}
                                                                lg={8}
                                                                style={{ textAlign: isMobile ? 'left' : 'right' }}
                                                            >
                                                                <Text
                                                                    type="warning"
                                                                    style={{
                                                                        fontSize: '1rem',
                                                                        fontWeight: 'bold',
                                                                        color: '#00b452',
                                                                    }}
                                                                >
                                                                    {(item.salary + '')?.replace(
                                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                                        ',',
                                                                    )}{' '}
                                                                    đ
                                                                </Text>
                                                            </Col>
                                                        </Row>
                                                        <Text style={{ color: '#37434f' }}>{item.location}</Text>
                                                        <Text style={{ color: '#37434f' }}>
                                                            {item.updatedAt
                                                                ? dayjs(item.updatedAt).locale(i18n.language).fromNow()
                                                                : dayjs(item.createdAt).locale(i18n.language).fromNow()}
                                                        </Text>
                                                    </Space>
                                                </Col>
                                            </Row>
                                            <Row gutter={16} align="middle" style={{ marginTop: '12px' }}>
                                                <Col
                                                    span={24}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center',
                                                        gap: 12,
                                                    }}
                                                >
                                                    <Access
                                                        permission={ALL_PERMISSIONS.APPLICATIONS.CREATE}
                                                        hideChildren
                                                    >
                                                        <Button
                                                            onClick={() => {
                                                                setIsModalOpen(true);
                                                                setJobDetail(item);
                                                            }}
                                                            style={{
                                                                color: '#00b452',
                                                                fontWeight: 'bold',
                                                            }}
                                                        >
                                                            {t('button.apply')}
                                                        </Button>
                                                    </Access>
                                                    <Button
                                                        shape="circle"
                                                        icon={
                                                            item.jobId !== undefined && saveJob[Number(item.jobId)] ? (
                                                                <HeartFilled
                                                                    style={{
                                                                        color: '#00b452',
                                                                        fontSize: '1rem',
                                                                        marginTop: 2,
                                                                    }}
                                                                />
                                                            ) : (
                                                                <HeartOutlined
                                                                    style={{
                                                                        color: '#00b452',
                                                                        fontSize: '1rem',
                                                                        marginTop: 2,
                                                                    }}
                                                                />
                                                            )
                                                        }
                                                        type="default"
                                                        onClick={() => toggleSave(Number(item.jobId))}
                                                    />
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                )
                            );
                        })}
                    </Row>
                    {(!displayJob || (displayJob && displayJob.length === 0)) && !isLoading && (
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '50px' }}>
                            <Empty description={t('notify.empty')} />
                        </div>
                    )}
                </div>
                <ApplyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} jobDetail={jobDetail} />
            </Spin>
        </Card>
    );
};

export default SaveJob;
