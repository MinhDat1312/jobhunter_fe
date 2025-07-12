import { Card, Col, Empty, Pagination, Row, Spin, Grid, Button } from 'antd';
import styles from '../../../styles/client.module.scss';
import { useEffect, useState } from 'react';
import type { IJob } from '../../../types/backend';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { sfIn } from 'spring-filter-query-builder';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';
import { callFetchJob } from '../../../config/api';
import { EnvironmentOutlined, HeartFilled, HeartOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { convertSlug, getLocationName } from '../../../config/utils';
import { useTranslation } from 'react-i18next';
import useSaveJob from '../../../hooks/useSaveJob';

const { useBreakpoint } = Grid;
dayjs.extend(relativeTime);

interface IProps {
    showPagination?: boolean;
}

const JobCard = (props: IProps) => {
    const { showPagination = false } = props;

    const { t, i18n } = useTranslation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const { saveJob, toggleSave } = useSaveJob();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, _setSearchParams] = useSearchParams();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [filter, _setFilter] = useState('');
    const [sortQuery, _setSortQuery] = useState('sort=updatedAt,desc');

    useEffect(() => {
        const fetchJob = async () => {
            setIsLoading(true);
            let query = `page=${current}&size=${pageSize}`;

            if (filter) {
                query += `&${filter}`;
            }
            if (sortQuery) {
                query += `&${sortQuery}`;
            }

            const queryLocation = searchParams.get('location');
            const querySkills = searchParams.get('skills');
            const queryRecruiters = searchParams.get('recruiters');
            if (queryLocation || querySkills || queryRecruiters) {
                let q = '';
                if (queryLocation) {
                    const locationNames = queryLocation.split(',').map((item) => getLocationName(item));
                    q = sfIn('location', locationNames).toString();
                }
                if (querySkills) {
                    const skillNames = sfIn('skills.name', querySkills.split(',')).toString();
                    q = q.length !== 0 ? q + ' and ' + `${skillNames}` : `${skillNames}`;
                }
                if (queryRecruiters) {
                    const recruiterNames = sfIn('recruiter.fullName', queryRecruiters.split(',')).toString();
                    q = q.length !== 0 ? q + ' and ' + `${recruiterNames}` : `${recruiterNames}`;
                }
                query += `&filter=${encodeURIComponent(q)}`;
            }

            const res = await callFetchJob(query);
            if (res && res.data) {
                setDisplayJob(res.data.result);
                setTotal(res.data.meta.total);
            }
            setIsLoading(false);
        };

        fetchJob();
    }, [current, pageSize, filter, sortQuery, location]);

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.title);
        navigate(`/job/${slug}?id=${item.jobId}`);
    };

    const handleOnchangePage = (pagination: { current: number; pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    return (
        <div className={`${styles['card-job-section']}`}>
            <div className={`${styles['job-content']}`}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles['dflex-mobile'] : styles['dflex-pc']}>
                                <span className={styles['title']}> {t('latest_jobs')}</span>
                                {!showPagination && (
                                    <Link to="job" style={{ color: '#00b452' }}>
                                        {t('view_all')}
                                    </Link>
                                )}
                            </div>
                        </Col>

                        {displayJob?.map((item) => {
                            return (
                                item.active && (
                                    <Col span={24} md={12} key={item.jobId}>
                                        <Card size="small" title={null} hoverable>
                                            <div className={styles['card-job-content']}>
                                                <div className={styles['card-job-left']}>
                                                    <img alt="example" src={`${item?.recruiter?.avatar}`} />
                                                </div>
                                                <div className={styles['card-job-right']}>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <div
                                                            className={styles['job-title']}
                                                            onClick={() => handleViewDetailJob(item)}
                                                        >
                                                            {item.title}
                                                        </div>
                                                        <Button
                                                            shape="circle"
                                                            icon={
                                                                item.jobId !== undefined &&
                                                                saveJob[Number(item.jobId)] ? (
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
                                                    </div>
                                                    <div className={styles['job-location']}>
                                                        <EnvironmentOutlined style={{ color: '#00b452' }} />
                                                        &nbsp;{item.location}
                                                    </div>
                                                    <div>
                                                        <ThunderboltOutlined style={{ color: 'orange' }} />
                                                        &nbsp;
                                                        {(item.salary + '')?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ
                                                    </div>
                                                    <div className={styles['job-updatedAt']}>
                                                        {item.updatedAt
                                                            ? dayjs(item.updatedAt).locale(i18n.language).fromNow()
                                                            : dayjs(item.createdAt).locale(i18n.language).fromNow()}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                )
                            );
                        })}

                        {(!displayJob || (displayJob && displayJob.length === 0)) && !isLoading && (
                            <div className={styles['empty']}>
                                <Empty description={t('notify.empty')} />
                            </div>
                        )}
                    </Row>
                    {showPagination && (
                        <>
                            <div style={{ marginTop: 30 }}></div>
                            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={pageSize}
                                    responsive
                                    onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                                />
                            </Row>
                        </>
                    )}
                </Spin>
            </div>
        </div>
    );
};

export default JobCard;
