import { Card, Col, Empty, Pagination, Row, Spin } from 'antd';
import styles from '../../../styles/client.module.scss';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import type { IJob } from '../../../types/backend';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { sfIn } from 'spring-filter-query-builder';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { callFetchJob } from '../../../config/api';
import { EnvironmentOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { convertSlug, getLocationName } from '../../../config/utils';
dayjs.extend(relativeTime);

interface IProps {
    showPagination?: boolean;
}

const JobCard = (props: IProps) => {
    const { showPagination = false } = props;

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState('');
    const [sortQuery, setSortQuery] = useState('sort=updatedAt,desc');

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
            if (queryLocation || querySkills) {
                let q = '';
                if (queryLocation) {
                    const locationNames = queryLocation.split(',').map((item) => getLocationName(item));
                    q = sfIn('location', locationNames).toString();
                }
                if (querySkills) {
                    q = queryLocation
                        ? q + ' and ' + `${sfIn('skills.name', querySkills.split(','))}`
                        : `${sfIn('skills.name', querySkills.split(','))}`;
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
                                <span className={styles['title']}>Công Việc Mới Nhất</span>
                                {!showPagination && <Link to="job">Xem tất cả</Link>}
                            </div>
                        </Col>

                        {displayJob?.map((item) => {
                            return (
                                item.active && (
                                    <Col span={24} md={12} key={item.jobId}>
                                        <Card
                                            size="small"
                                            title={null}
                                            hoverable
                                            onClick={() => handleViewDetailJob(item)}
                                        >
                                            <div className={styles['card-job-content']}>
                                                <div className={styles['card-job-left']}>
                                                    <img
                                                        alt="example"
                                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/recruiters/${
                                                            item?.recruiter?.avatar
                                                        }`}
                                                    />
                                                </div>
                                                <div className={styles['card-job-right']}>
                                                    <div className={styles['job-title']}>{item.title}</div>
                                                    <div className={styles['job-location']}>
                                                        <EnvironmentOutlined style={{ color: '#58aaab' }} />
                                                        &nbsp;{item.location}
                                                    </div>
                                                    <div>
                                                        <ThunderboltOutlined style={{ color: 'orange' }} />
                                                        &nbsp;
                                                        {(item.salary + '')?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ
                                                    </div>
                                                    <div className={styles['job-updatedAt']}>
                                                        {item.updatedAt
                                                            ? dayjs(item.updatedAt).locale('en').fromNow()
                                                            : dayjs(item.createdAt).locale('en').fromNow()}
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
                                <Empty description="Không có dữ liệu" />
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
