import { Col, Divider, Grid, Row } from 'antd';
import styles from '../../styles/client.module.scss';
import BlogCard from '../../components/client/card/blog.card';

const { useBreakpoint } = Grid;

const ClientBlogPage = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    return (
        <div className={styles['container']} style={{ marginTop: 20 }}>
            <Row gutter={[10, 10]}>
                <Col
                    lg={10}
                    md={10}
                    sm={24}
                    style={{
                        borderRight: isMobile ? '' : '1px solid #f0f0f0',
                        paddingRight: isMobile ? '' : 10,
                    }}
                ></Col>
                {isMobile && <Divider style={{ margin: 0 }} />}
                <Col lg={14} md={14} sm={24}>
                    <BlogCard showPagination={true} />
                </Col>
            </Row>
        </div>
    );
};

export default ClientBlogPage;
