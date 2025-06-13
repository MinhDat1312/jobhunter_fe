import { Col, Divider, Row, Skeleton, Tag } from 'antd';
import styles from '../../styles/client.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import type { IJob } from '../../types/backend';
import { useLocation } from 'react-router-dom';
import { callFetchJobById } from '../../config/api';
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';
dayjs.extend(relativeTime);

const ClientJobDetailPage = () => {
    const [jobDetail, setJobDetail] = useState<IJob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get('id');

    useEffect(() => {
        const fetchJob = async () => {
            if (id) {
                setIsLoading(true);
                const res = await callFetchJobById(id);
                if (res?.data) {
                    setJobDetail(res.data);
                }
                setIsLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    return (
        <div className={`${styles['container']} ${styles['detail-job-section']}`}>
            {isLoading ? (
                <Skeleton />
            ) : (
                <Row gutter={[20, 20]}>
                    {jobDetail && jobDetail.jobId && (
                        <>
                            <Col span={24} md={16}>
                                <div className={styles['header']}>{jobDetail.title}</div>
                                <div>
                                    <button onClick={() => setIsModalOpen(true)} className={styles['btn-apply']}>
                                        Apply Now
                                    </button>
                                </div>
                                <Divider />
                                <div className={styles['skills']}>
                                    {jobDetail?.skills?.map((item, index) => {
                                        return (
                                            <Tag key={`${index}-key`} color="gold">
                                                {item.name}
                                            </Tag>
                                        );
                                    })}
                                </div>
                                <div className={styles['salary']}>
                                    <DollarOutlined />
                                    <span>
                                        &nbsp;{(jobDetail.salary + '')?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ
                                    </span>
                                </div>
                                <div className={styles['location']}>
                                    <EnvironmentOutlined style={{ color: '#58aaab' }} />
                                    &nbsp;{jobDetail.location}
                                </div>
                                <div>
                                    <HistoryOutlined />{' '}
                                    {jobDetail.updatedAt
                                        ? dayjs(jobDetail.updatedAt).locale('en').fromNow()
                                        : dayjs(jobDetail.createdAt).locale('en').fromNow()}
                                </div>
                                <Divider />
                                {parse(jobDetail.description)}
                            </Col>

                            <Col span={24} md={8}>
                                <div className={styles['recruiter']}>
                                    <div>
                                        <img
                                            width={'200px'}
                                            alt="example"
                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/recruiters/${
                                                jobDetail.recruiter?.logo
                                            }`}
                                        />
                                    </div>
                                    <div>{jobDetail.recruiter?.fullName}</div>
                                </div>
                            </Col>
                        </>
                    )}
                </Row>
            )}
            {/* <ApplyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} jobDetail={jobDetail} /> */}
        </div>
    );
};

export default ClientJobDetailPage;
