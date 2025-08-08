import { Col, Divider, Row } from 'antd';
import styles from '../../styles/client.module.scss';
import SearchClient from '../../components/client/search/search.client';
import JobCard from '../../components/client/card/job.card';

const ClientJobPage = () => {
    return (
        <div className={styles['container']} style={{ marginTop: 20 }}>
            <Row gutter={[10, 10]}>
                <Col span={24}>
                    <SearchClient />
                </Col>
                <Divider style={{ margin: 0 }} />
                <Col span={24}>
                    <JobCard showPagination={true} />
                </Col>
            </Row>
        </div>
    );
};

export default ClientJobPage;
