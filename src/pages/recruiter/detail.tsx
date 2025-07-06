import { useEffect, useState } from 'react';
import styles from '../../styles/client.module.scss';
import { Col, Divider, Row, Skeleton } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import type { IRecruiter } from '../../types/backend';
import { useLocation } from 'react-router-dom';
import { callFetchRecruiterById } from '../../config/api';
import parse from 'html-react-parser';

const ClientRecruiterDetailPage = () => {
    const [recruiterDetail, setRecruiterDetail] = useState<IRecruiter | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get('id');

    useEffect(() => {
        const fetchRecruiter = async () => {
            if (id) {
                setIsLoading(true);
                const res = await callFetchRecruiterById(id);
                if (res?.data) {
                    setRecruiterDetail(res.data);
                }
                setIsLoading(false);
            }
        };

        fetchRecruiter();
    }, [id]);

    return (
        <div className={`${styles['container']} ${styles['detail-job-section']}`}>
            {isLoading ? (
                <Skeleton />
            ) : (
                recruiterDetail &&
                recruiterDetail.userId && (
                    <>
                        <Row gutter={[20, 20]}>
                            <Col span={12}>
                                <div className={styles['header']}>{recruiterDetail.fullName}</div>
                                <div className={styles['location']}>
                                    <EnvironmentOutlined style={{ color: '#00b452' }} />
                                    &nbsp;
                                    {recruiterDetail.address ? recruiterDetail.address : ''}
                                </div>
                            </Col>
                            <Col span={12}>
                                    <div className={styles['recruiter']}>
                                        <div>
                                            <img width={200} alt="example" src={`${recruiterDetail?.avatar}`} />
                                        </div>
                                    </div>
                                </Col>
                        </Row>
                        <Divider />
                        <Row gutter={[20, 20]}>
                            <Col span={24}>{parse(recruiterDetail?.description ?? '')}</Col>
                        </Row>
                    </>
                )
            )}
        </div>
    );
};

export default ClientRecruiterDetailPage;
