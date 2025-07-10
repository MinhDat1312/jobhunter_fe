import { useEffect, useState } from 'react';
import styles from '../../styles/client.module.scss';
import { Avatar, Button, Col, Divider, Row, Skeleton, Space, Typography } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import type { IRecruiter } from '../../types/backend';
import { useLocation } from 'react-router-dom';
import { callFetchRecruiterById } from '../../config/api';
import parse from 'html-react-parser';
import { useTranslation } from 'react-i18next';
import useFollowRecruiter from '../../hooks/useFollowRecruiter';

const { Text } = Typography;

const ClientRecruiterDetailPage = () => {
    const { t } = useTranslation();
    const [recruiterDetail, setRecruiterDetail] = useState<IRecruiter | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { followRecruiter, toggleFollow } = useFollowRecruiter();

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
                            <Col>
                                <Avatar
                                    shape="square"
                                    size={200}
                                    src={recruiterDetail?.avatar}
                                    alt="Recruiter Avatar"
                                    style={{ borderRadius: 12, border: '2px solid #c7f7dd', padding: 12 }}
                                />
                            </Col>
                            <Col>
                                <Space direction="vertical" size={50} style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: '2.25rem' }}>
                                            {recruiterDetail.fullName}
                                        </Text>
                                        <Text style={{ color: '#37434f', fontSize: '1rem', fontWeight: '600' }}>
                                            <EnvironmentOutlined style={{ color: '#00b452' }} />
                                            &nbsp;
                                            {recruiterDetail.address ? recruiterDetail.address : ''}
                                        </Text>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            toggleFollow(Number(recruiterDetail.userId));
                                        }}
                                        className="btn-follow"
                                        style={{
                                            backgroundColor: followRecruiter[Number(recruiterDetail.userId)]
                                                ? '#00b452'
                                                : '#ffffff',
                                            color: followRecruiter[Number(recruiterDetail.userId)]
                                                ? '#ffffff'
                                                : '#00b452',
                                        }}
                                    >
                                        {followRecruiter[Number(recruiterDetail.userId)]
                                            ? t('button.unfollow')
                                            : t('button.follow')}
                                    </Button>
                                </Space>
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
