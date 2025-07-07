import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { callStatisticsApplication, callStatisticsJob, callStatisticsUser } from '../../config/api';
import StatisticsCard from '../../components/statistics.card';
import LineChartStatistics from '../../components/line.chart';

const DashboardPage = () => {
    const [countUser, setCountUser] = useState<Record<string, number>>({});
    const [countJob, setCountJob] = useState<Record<string, number>>({});
    const [countApplication, setCountApplication] = useState<Record<string, number>>({});
    const [data, setData] = useState<{ name: string; visits: number }[]>([]);

    useEffect(() => {
        const init = async () => {
            const [resUsers, resJobs, resApplications] = await Promise.all([
                callStatisticsUser(),
                callStatisticsJob(),
                callStatisticsApplication(),
            ]);

            if (resUsers?.data) setCountUser(resUsers.data);
            if (resJobs?.data) setCountJob(resJobs.data);
            if (resApplications?.data) setCountApplication(resApplications.data);
        };

        init();
    }, []);

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col xs={24} md={12} lg={8}>
                    <StatisticsCard countObject={countUser} title="statistics.user.title" />
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <StatisticsCard countObject={countJob} title="statistics.job.title" />
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <StatisticsCard countObject={countApplication} title="statistics.application.title" />
                </Col>
                <Col span={24} style={{ marginBlock: '36px' }}>
                    <LineChartStatistics title="Biểu đồ thống kê lượt truy cập" data={data} dataKey="visits" />
                </Col>
            </Row>
        </>
    );
};

export default DashboardPage;
