import { Col, Divider, Grid, Row } from 'antd';
import styles from '../../styles/client.module.scss';
import BlogCard from '../../components/client/card/blog/blog.card';
import TrendingCard from '../../components/client/card/blog/trending.card';
import SearchBlog from '../../components/client/search/search.blog';

const { useBreakpoint } = Grid;

const ClientBlogPage = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    return (
        <div className={styles['container']} style={{ marginTop: 20 }}>
            <Row gutter={[10, 10]}>
                <Col span={24}>
                    <SearchBlog />
                </Col>
                <Col
                    lg={8}
                    md={8}
                    sm={24}
                    style={{
                        borderRight: isMobile ? '' : '1px solid #f0f0f0',
                        paddingRight: isMobile ? '' : 10,
                    }}
                >
                    <TrendingCard />
                </Col>
                {isMobile && <Divider style={{ margin: 0 }} />}
                <Col lg={16} md={16} sm={24}>
                    <BlogCard showPagination={true} />
                </Col>
            </Row>
        </div>
    );
};

export default ClientBlogPage;
