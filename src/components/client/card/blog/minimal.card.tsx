import { useEffect, useState } from 'react';
import type { IBlog } from '../../../../types/backend';
import { sfEqual } from 'spring-filter-query-builder';
import { callFetchBlog } from '../../../../config/api';
import { Avatar, Card, Col, Grid, Row, Spin } from 'antd';
import { motion } from 'motion/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'react-i18next';
import styles from '../../../../styles/client.module.scss';

const MotionCol = motion(Col);
dayjs.extend(relativeTime);
const { useBreakpoint } = Grid;

const MinimalCard = () => {
    const { t, i18n } = useTranslation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [trendingBlog, setTrendingBlog] = useState<IBlog[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [limit, _setLimit] = useState(5);
    const [sortQuery, _setSortQuery] = useState(
        'sort=activity.totalReads,desc&sort=activity.totalLikes,desc&sort=createdAt,asc',
    );

    useEffect(() => {
        const fetchBlog = async () => {
            setIsLoading(true);
            let query = `page=1&size=${limit}`;
            let q = sfEqual('draft', 'false').toString();

            if (sortQuery) {
                query += `&${sortQuery}`;
            }
            query += `&filter=${encodeURIComponent(q)}`;

            const res = await callFetchBlog(query);
            if (res && res.data) {
                setTrendingBlog(res.data.result);
            }
            setIsLoading(false);
        };

        fetchBlog();
    }, [limit, sortQuery]);

    return (
        <Spin spinning={isLoading} tip="Loading...">
            <Row gutter={[20, 20]}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ width: '100%' }}
                >
                    <Col span={24}>
                        <motion.div className={isMobile ? styles['dflex-mobile'] : styles['dflex-pc']}>
                            <span className={styles['title']}> {t('trending_blogs')}</span>
                        </motion.div>
                    </Col>
                    {trendingBlog?.map((blog, index) => {
                        return (
                            blog && (
                                <MotionCol
                                    span={24}
                                    key={blog.blogId}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    style={{ paddingLeft: 0, marginBottom: 16 }}
                                >
                                    <Card size="small" title={null} hoverable style={{ cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <h1
                                                style={{
                                                    fontSize: '2.5rem',
                                                    color: '#7bca9e',
                                                }}
                                            >
                                                {index < 9 ? '0' + (index + 1) : index + 1}
                                            </h1>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    gap: 8,
                                                }}
                                            >
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            gap: '8px',
                                                        }}
                                                    >
                                                        <Avatar
                                                            src={blog?.author?.avatar}
                                                            alt="avatar"
                                                            size={24}
                                                            shape="circle"
                                                        >
                                                            {!blog?.author?.avatar &&
                                                                blog?.author?.username?.substring(0, 2)?.toUpperCase()}
                                                        </Avatar>
                                                        <p className={styles['blog-username']}>
                                                            @{blog.author?.username}
                                                        </p>
                                                    </div>
                                                    <p>
                                                        {blog.updatedAt
                                                            ? dayjs(blog.updatedAt).locale(i18n.language).fromNow()
                                                            : dayjs(blog.createdAt).locale(i18n.language).fromNow()}
                                                    </p>
                                                </div>
                                                <div style={{ color: '#353535', fontWeight: 'bold', fontSize: '1rem' }}>
                                                    {blog.title}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </MotionCol>
                            )
                        );
                    })}
                </motion.div>
            </Row>
        </Spin>
    );
};

export default MinimalCard;
