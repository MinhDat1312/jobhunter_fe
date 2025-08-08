import { Button, Col, Divider, Row, Skeleton, Tag } from 'antd';
import styles from '../../styles/client.module.scss';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import type { IJob } from '../../types/backend';
import { useLocation } from 'react-router-dom';
import { callFetchJobById } from '../../config/api';
import { DollarOutlined, EnvironmentOutlined, HeartFilled, HeartOutlined, HistoryOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';
import ApplyModal from '../../components/client/modal/apply.modal';
import Access from '../../components/share/access';
import { ALL_PERMISSIONS } from '../../config/permissions';
import { useTranslation } from 'react-i18next';
import useSaveJob from '../../hooks/useSaveJob';
import { motion } from 'motion/react';

dayjs.extend(relativeTime);

const ClientJobDetailPage = () => {
    const { t, i18n } = useTranslation();

    const [jobDetail, setJobDetail] = useState<IJob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { saveJob, toggleSave } = useSaveJob();

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
                                <motion.div
                                    initial={{ x: -100, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <div className={styles['header']}>{jobDetail.title}</div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                    >
                                        <Access permission={ALL_PERMISSIONS.APPLICATIONS.CREATE} hideChildren>
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className={styles['btn-apply']}
                                            >
                                                {t('button.apply')}
                                            </button>
                                        </Access>
                                        <Button
                                            shape="circle"
                                            icon={
                                                jobDetail.jobId !== undefined && saveJob[Number(jobDetail.jobId)] ? (
                                                    <HeartFilled
                                                        style={{
                                                            color: '#00b452',
                                                            fontSize: '1rem',
                                                            marginTop: 2,
                                                        }}
                                                    />
                                                ) : (
                                                    <HeartOutlined
                                                        style={{
                                                            color: '#00b452',
                                                            fontSize: '1rem',
                                                            marginTop: 2,
                                                        }}
                                                    />
                                                )
                                            }
                                            type="default"
                                            onClick={() => toggleSave(Number(jobDetail.jobId))}
                                        />
                                    </div>
                                </motion.div>
                                <Divider />
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.8,
                                    }}
                                >
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
                                        <EnvironmentOutlined style={{ color: '#00b452' }} />
                                        &nbsp;{jobDetail.location}
                                    </div>
                                    <div>
                                        <HistoryOutlined />{' '}
                                        {jobDetail.updatedAt
                                            ? dayjs(jobDetail.updatedAt).locale(i18n.language).fromNow()
                                            : dayjs(jobDetail.createdAt).locale(i18n.language).fromNow()}
                                    </div>
                                    <Divider />
                                    {parse(jobDetail.description)}
                                </motion.div>
                            </Col>
                            <Col span={24} md={8}>
                                <motion.div
                                    className={styles['recruiter']}
                                    initial={{ x: 100, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <div>
                                        <img width={'200px'} alt="example" src={`${jobDetail.recruiter?.avatar}`} />
                                    </div>
                                    <div>{jobDetail.recruiter?.fullName}</div>
                                </motion.div>
                            </Col>
                        </>
                    )}
                </Row>
            )}
            <ApplyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} jobDetail={jobDetail} />
        </div>
    );
};

export default ClientJobDetailPage;
