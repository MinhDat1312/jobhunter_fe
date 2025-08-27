import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { IBlog, INotification } from '../../types/backend';
import { callFetchBlogById } from '../../config/api';
import styles from '../../styles/client.module.scss';
import { Avatar, Col, Divider, Image, Row, Skeleton, Typography } from 'antd';
import { motion } from 'motion/react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { HeartFilled, HeartOutlined, MessageOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../hooks/hook';
import useLikeBlog from '../../hooks/useLikeBlog';
import DOMPurify from 'dompurify';

const MotionCol = motion(Col);
const { Text } = Typography;

const ClientBlogDetailPage = () => {
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params?.get('id');

    const user = useAppSelector((state) => state.account.user);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [blogDetail, setBlogDetail] = useState<null | IBlog>(null);
    const [actorLikeNotifications, setActorLikeNotifications] = useState<INotification[]>([]);
    // const { handleOnLike } = useLikeBlog({ setDisplayBlog });

    useEffect(() => {
        const likeNotifications = user?.actorNotifications?.filter((not) => not.type === 'LIKE');
        setActorLikeNotifications(likeNotifications ?? []);
    }, [user.actorNotifications]);

    useEffect(() => {
        const fetchBlog = async () => {
            if (id) {
                setIsLoading(true);
                const res = await callFetchBlogById(id);
                if (res?.data) {
                    setBlogDetail(res.data);
                }
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    return (
        <div className={`${styles['container']}`}>
            {isLoading ? (
                <Skeleton />
            ) : (
                blogDetail &&
                blogDetail.blogId && (
                    <>
                        <Row gutter={[20, 20]}>
                            <MotionCol
                                span={24}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Image style={{ width: '100%' }} src={blogDetail.banner} alt={blogDetail.title} />
                            </MotionCol>
                            <MotionCol
                                span={24}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Text style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{blogDetail.title}</Text>
                            </MotionCol>
                            <MotionCol
                                span={24}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Row>
                                    <Col span={12}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '8px',
                                            }}
                                        >
                                            <Avatar
                                                src={blogDetail?.author?.avatar}
                                                alt="avatar"
                                                size={44}
                                                shape="circle"
                                            >
                                                {!blogDetail?.author?.avatar &&
                                                    blogDetail?.author?.username?.substring(0, 2)?.toUpperCase()}
                                            </Avatar>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '4px',
                                                }}
                                            >
                                                <p style={{ fontSize: '1rem' }}>{blogDetail.author?.fullName}</p>
                                                <p style={{ fontSize: '1rem' }}>@{blogDetail.author?.username}</p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col
                                        span={12}
                                        style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}
                                    >
                                        <p style={{ fontSize: '1rem' }}>
                                            Published on{' '}
                                            {dayjs(blogDetail.createdAt).locale(i18n.language).format('DD MMMM YYYY')}
                                        </p>
                                    </Col>
                                </Row>
                            </MotionCol>
                        </Row>
                        <Divider />
                        <Row gutter={[20, 20]}>
                            <MotionCol
                                style={{
                                    paddingInline: 16,
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    gap: '16px',
                                }}
                                span={24}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'start',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 30,
                                            height: 30,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #00b452',
                                            cursor: 'pointer',
                                        }}
                                        // onClick={() =>
                                        //     handleOnLike(
                                        //         blog,
                                        //         actorLikeNotifications.some((not) => not.blog.blogId === blog.blogId),
                                        //     )
                                        // }
                                    >
                                        {actorLikeNotifications.some((not) => not.blog.blogId === blogDetail.blogId) ? (
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
                                    </div>
                                    <span style={{ color: '#00b452', fontSize: '1rem' }}>
                                        {blogDetail?.activity?.totalLikes}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'start',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 30,
                                            height: 30,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #00b452',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <MessageOutlined
                                            style={{
                                                color: '#00b452',
                                                fontSize: '1rem',
                                            }}
                                        />
                                    </div>
                                    <span style={{ color: '#00b452', fontSize: '1rem' }}>
                                        {blogDetail?.activity?.totalComments}
                                    </span>
                                </div>
                            </MotionCol>
                        </Row>
                        <Divider />
                        <Row gutter={[20, 20]}>
                            {blogDetail.content?.map((con, index) => {
                                return (
                                    <MotionCol
                                        span={24}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                        key={index}
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(con),
                                        }}
                                    ></MotionCol>
                                );
                            })}
                        </Row>
                    </>
                )
            )}
        </div>
    );
};

export default ClientBlogDetailPage;
