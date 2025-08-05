import { useEffect, useState } from 'react';
import { callFetchBlog } from '../../../../config/api';
import type { IBlog, INotification } from '../../../../types/backend';
import { useLocation } from 'react-router-dom';
import styles from '../../../../styles/client.module.scss';
import { Avatar, Card, Col, Empty, Grid, Pagination, Row, Spin, Tag } from 'antd';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { sfEqual } from 'spring-filter-query-builder';
import { useAppSelector } from '../../../../hooks/hook';
import useLikeBlog from '../../../../hooks/useLikeBlog';

dayjs.extend(relativeTime);
const { useBreakpoint } = Grid;
const MotionCol = motion(Col);

interface IProps {
    showPagination?: boolean;
}

const BlogCard = (props: IProps) => {
    const { showPagination = false } = props;

    const { t, i18n } = useTranslation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const location = useLocation();

    const user = useAppSelector((state) => state.account.user);
    const [actorLikeNotifications, setActorLikeNotifications] = useState<INotification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [filter, _setFilter] = useState('');
    const [sortQuery, _setSortQuery] = useState('sort=updatedAt,desc');
    const [displayBlog, setDisplayBlog] = useState<IBlog[] | null>(null);
    const [total, setTotal] = useState(0);
    const { handleOnLike } = useLikeBlog({ setDisplayBlog });

    useEffect(() => {
        const likeNotifications = user?.actorNotifications?.filter((not) => not.type === 'LIKE');
        setActorLikeNotifications(likeNotifications ?? []);
    }, [user.actorNotifications]);

    useEffect(() => {
        const fetchBlog = async () => {
            setIsLoading(true);
            let query = `page=${current}&size=${pageSize}`;
            let q = sfEqual('draft', 'false').toString();

            if (filter) {
                query += `&${filter}`;
            }
            if (sortQuery) {
                query += `&${sortQuery}`;
            }
            query += `&filter=${encodeURIComponent(q)}`;

            const res = await callFetchBlog(query);
            if (res && res.data) {
                setDisplayBlog(res.data.result);
                setTotal(res.data.meta.total);
            }
            setIsLoading(false);
        };
        fetchBlog();
    }, [current, pageSize, filter, sortQuery, location]);

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
        <div className={`${styles['card-blog-section']}`}>
            <div className={`${styles['blog-content']}`}>
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
                                    <span className={styles['title']}> {t('latest_blogs')}</span>
                                    {!showPagination && (
                                        <Link to="blog" style={{ color: '#00b452', fontSize: '1rem' }}>
                                            {t('view_all')}
                                        </Link>
                                    )}
                                </motion.div>
                            </Col>
                        </motion.div>
                        {displayBlog?.map((blog) => {
                            return (
                                blog && (
                                    <MotionCol
                                        span={24}
                                        key={blog.blogId}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <Card size="small" title={null} hoverable>
                                            <div className={styles['card-blog-content']}>
                                                <div className={styles['card-blog-top']}>
                                                    <div className={styles['card-blog-left']}>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    gap: '8px',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <Avatar
                                                                    src={blog?.author?.avatar}
                                                                    alt="avatar"
                                                                    size={24}
                                                                    shape="circle"
                                                                >
                                                                    {!blog?.author?.avatar &&
                                                                        blog?.author?.username
                                                                            ?.substring(0, 2)
                                                                            ?.toUpperCase()}
                                                                </Avatar>
                                                                <p className={styles['blog-username']}>
                                                                    @{blog.author?.username}
                                                                </p>
                                                            </div>
                                                            <p>
                                                                {blog.updatedAt
                                                                    ? dayjs(blog.updatedAt)
                                                                          .locale(i18n.language)
                                                                          .fromNow()
                                                                    : dayjs(blog.createdAt)
                                                                          .locale(i18n.language)
                                                                          .fromNow()}
                                                            </p>
                                                        </div>
                                                        <div className={styles['blog-title']}>{blog.title}</div>
                                                        {!isMobile && (
                                                            <div className={styles['blog-description']}>
                                                                {blog.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={styles['card-blog-right']}>
                                                        <img alt="example" src={`${blog?.banner}`} />
                                                    </div>
                                                </div>
                                                <div className={styles['card-blog-down']}>
                                                    <div className={styles['blog-tags']}>
                                                        {blog?.tags?.map((tag, index) => {
                                                            return (
                                                                <Tag
                                                                    key={index}
                                                                    color="green"
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        padding: '2px 10px',
                                                                    }}
                                                                >
                                                                    {tag.toUpperCase()}
                                                                </Tag>
                                                            );
                                                        })}
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() =>
                                                            handleOnLike(
                                                                blog,
                                                                actorLikeNotifications.some(
                                                                    (not) => not.blog.blogId === blog.blogId,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        {actorLikeNotifications.some(
                                                            (not) => not.blog.blogId === blog.blogId,
                                                        ) ? (
                                                            <HeartFilled
                                                                style={{
                                                                    color: '#00b452',
                                                                    fontSize: '1rem',
                                                                }}
                                                            />
                                                        ) : (
                                                            <HeartOutlined
                                                                style={{
                                                                    color: '#00b452',
                                                                    fontSize: '1rem',
                                                                }}
                                                            />
                                                        )}

                                                        <span style={{ color: '#00b452', fontSize: '1rem' }}>
                                                            {blog?.activity?.totalLikes}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </MotionCol>
                                )
                            );
                        })}
                        {(!displayBlog || (displayBlog && displayBlog.length === 0)) && !isLoading && (
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

export default BlogCard;
