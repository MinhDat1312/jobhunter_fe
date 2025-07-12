import { Card, Col, Divider, Empty, Pagination, Row, Spin, Grid } from 'antd';
import styles from '../../../styles/client.module.scss';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { IRecruiter } from '../../../types/backend';
import { callFetchRecruiter } from '../../../config/api';
import { convertSlug } from '../../../config/utils';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import useTotalJobRecruiter from '../../../hooks/useTotalJobRecruiter';

const { useBreakpoint } = Grid;
const MotionCol = motion(Col);

interface IProps {
    showPagination?: boolean;
}

const RecruiterCard = (props: IProps) => {
    const { t, i18n } = useTranslation();

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const { showPagination = false } = props;

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayRecruiter, setDisplayRecruiter] = useState<IRecruiter[] | null>(null);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, _setFilter] = useState('');
    const [sortQuery, _setSortQuery] = useState('sort=updatedAt,desc');
    const { totalJob } = useTotalJobRecruiter();

    useEffect(() => {
        const fetchRecruiter = async () => {
            setIsLoading(true);
            let query = `page=${current}&size=${pageSize}`;

            if (filter) {
                query += `&${filter}`;
            }
            if (sortQuery) {
                query += `&${sortQuery}`;
            }

            const res = await callFetchRecruiter(query);
            if (res && res.data) {
                setDisplayRecruiter(res.data.result);
                setTotal(res.data.meta.total);
            }
            setIsLoading(false);
        };

        fetchRecruiter();
    }, [current, pageSize, filter, sortQuery]);

    const handleViewDetailRecruiter = (item: IRecruiter) => {
        if (item.fullName) {
            const slug = convertSlug(item.fullName);
            navigate(`/recruiter/${slug}?id=${item.userId}`);
        }
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
        <div className={`${styles['recruiter-section']}`}>
            <div className={styles['recruiter-content']}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ width: '100%' }}
                        >
                            <Col span={24}>
                                <div className={isMobile ? styles['dflex-mobile'] : styles['dflex-pc']}>
                                    <span className={styles['title']}> {t('featured_employers')}</span>
                                    {!showPagination && (
                                        <Link to="recruiter" style={{ color: '#00b452', fontSize: '1rem' }}>
                                            {t('view_all')}
                                        </Link>
                                    )}
                                </div>
                            </Col>
                        </motion.div>
                        {displayRecruiter?.map((item) => {
                            return (
                                <MotionCol
                                    span={24}
                                    md={12}
                                    xs={24}
                                    lg={6}
                                    key={item.userId}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <Card
                                        onClick={() => handleViewDetailRecruiter(item)}
                                        style={{ height: 350, cursor: 'pointer', position: 'relative' }}
                                        hoverable
                                        cover={
                                            <div className={styles['card-customize']}>
                                                <img
                                                    style={{ maxWidth: '200px' }}
                                                    alt="example"
                                                    src={`${item?.avatar}`}
                                                />
                                                <motion.div
                                                    style={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        zIndex: 1,
                                                        borderRadius: '8px',
                                                        backgroundColor: '#ffffff',
                                                        color: '#00b452',
                                                        padding: '0 8px',
                                                        fontSize: '1rem',
                                                    }}
                                                    animate={{
                                                        boxShadow: [
                                                            '0 0 5px #c7f7dd',
                                                            '0 0 20px #c7f7dd, 0 0 30px #c7f7dd',
                                                            '0 0 5px #c7f7dd',
                                                        ],
                                                    }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        repeatType: 'loop',
                                                    }}
                                                >
                                                    {totalJob[Number(item.userId)]} {t('job')}
                                                    {totalJob[Number(item.userId)] === 1
                                                        ? ''
                                                        : i18n.language === 'en'
                                                        ? 's'
                                                        : ''}
                                                </motion.div>
                                            </div>
                                        }
                                    >
                                        <Divider />
                                        <h2 style={{ textAlign: 'center' }}>{item.fullName}</h2>
                                    </Card>
                                </MotionCol>
                            );
                        })}
                        {(!displayRecruiter || (displayRecruiter && displayRecruiter.length === 0)) && !isLoading && (
                            <div className={styles['empty']}>
                                <Empty description={t('notify.empty')} />
                            </div>
                        )}
                    </Row>
                    {showPagination && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ width: '100%' }}
                        >
                            <div style={{ marginTop: 30 }}></div>
                            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={pageSize}
                                    responsive
                                    showLessItems
                                    onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                                />
                            </Row>
                        </motion.div>
                    )}
                </Spin>
            </div>
        </div>
    );
};

export default RecruiterCard;
