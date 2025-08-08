import { callFetchTag } from '../../../../config/api';
import styles from '../../../../styles/client.module.scss';
import { Col, Grid, Row, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MinimalCard from './minimal.card';
import { useNavigate, useSearchParams } from 'react-router-dom';

dayjs.extend(relativeTime);
const { useBreakpoint } = Grid;

const TrendingCard = () => {
    const { t } = useTranslation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const navigate = useNavigate();
    const [searchParams, _setSearchParams] = useSearchParams();
    const queryTitle = searchParams.get('title');
    const queryAuthors = searchParams.get('authors');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tags, setTags] = useState<{ label: string; value: number }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const tags = searchParams.get('tags')?.split(',') || [];
        setSelectedTags(tags);
    }, [searchParams]);

    useEffect(() => {
        const fetchTag = async () => {
            setIsLoading(true);
            const res = await callFetchTag('');
            if (res && res.data) {
                const tagOptions = res.data.map((tag) => ({
                    label: tag[0] as string,
                    value: Number(tag[1]),
                }));
                setTags(tagOptions.slice(0, 10));
            }
            setIsLoading(false);
        };

        fetchTag();
    }, []);

    const fetchBlogByTag = async (tags: string[]) => {
        let query = tags.length !== 0 ? `tags=${tags?.join(',')}` : '';
        if (queryTitle) {
            query = query.length === 0 ? `title=${queryTitle}` : query + `&title=${queryTitle}`;
        }
        if (queryAuthors) {
            query = query.length === 0 ? `authors=${queryAuthors}` : query + `&authors=${queryAuthors}`;
        }
        navigate(`/blog?${query}`);
    };

    return (
        <div className={`${styles['card-blog-section']}`}>
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
                                <span className={styles['title']}> {t('tags_trending')}</span>
                            </motion.div>
                        </Col>
                        <Col span={24}>
                            <motion.div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 0px' }}>
                                {tags?.map((tag, index) => {
                                    return (
                                        <Tag
                                            key={index}
                                            color={
                                                selectedTags.some((item) => item === tag.label) ? '#006400' : 'green'
                                            }
                                            style={{
                                                cursor: 'pointer',
                                                padding: '2px 10px',
                                            }}
                                            onClick={() => {
                                                setSelectedTags((prev) => {
                                                    const isSelected = prev.includes(tag.label);
                                                    const updated = isSelected
                                                        ? prev.filter((t) => t !== tag.label)
                                                        : [...prev, tag.label];

                                                    fetchBlogByTag(updated);
                                                    return updated;
                                                });
                                            }}
                                        >
                                            {tag.label.toUpperCase()}
                                        </Tag>
                                    );
                                })}
                            </motion.div>
                        </Col>
                    </motion.div>
                </Row>
            </Spin>
            <MinimalCard />
        </div>
    );
};

export default TrendingCard;
