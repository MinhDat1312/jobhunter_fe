import { Col, Row } from 'antd';
import styles from '../../styles/client.module.scss';
import RecruiterCard from '../../components/client/card/recruiter.card';

const ClientRecruiterPage = () => {
    return (
        <div className={styles['container']} style={{ marginTop: 20 }}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <RecruiterCard showPagination={true} />
                </Col>
            </Row>
        </div>
    );
};

export default ClientRecruiterPage;
