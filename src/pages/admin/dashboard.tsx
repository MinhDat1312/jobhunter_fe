import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import {
    callStatisticsApplication,
    callStatisticsApplicationByYear,
    callStatisticsJob,
    callStatisticsUser,
} from '../../config/api';
import StatisticsCard from '../../components/statistics.card';
import LineChartStatistics from '../../components/line.chart';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
    const { t, i18n } = useTranslation();

    const [countUser, setCountUser] = useState<Record<string, number>>({});
    const [countJob, setCountJob] = useState<Record<string, number>>({});
    const [countApplication, setCountApplication] = useState<Record<string, number>>({});
    const [year, setYear] = useState(new Date(Date.now()).getFullYear());
    const [_countApplicationYear, setCountApplicationYear] = useState<Record<number, number>>({});
    const [categories, setCategories] = useState<any[]>([]);
    const [series, setSeries] = useState<{ name: string; data: number[]; color: string }[]>([]);

    useEffect(() => {
        const init = async () => {
            const res = await callStatisticsApplicationByYear(year);

            if (res?.data) {
                setCountApplicationYear(res.data);

                const data = Array.from({ length: 12 }, (_, i) => res.data?.[i + 1] ?? 0);
                setSeries([
                    {
                        name: t('application'),
                        data,
                        color: '#00b452',
                    },
                ]);
            }
        };

        init();
    }, [year, i18n.language]);

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

    useEffect(() => {
        setCategories([
            t('month.jan'),
            t('month.feb'),
            t('month.mar'),
            t('month.apr'),
            t('month.may'),
            t('month.jun'),
            t('month.jul'),
            t('month.aug'),
            t('month.sep'),
            t('month.oct'),
            t('month.nov'),
            t('month.dec'),
        ]);
    }, [i18n.language]);

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
                    <LineChartStatistics
                        title="statistics.application.line_chart"
                        categories={categories}
                        dataSeries={series}
                        year={year}
                        onChangeYear={setYear}
                    />
                </Col>
            </Row>
        </>
    );
};

export default DashboardPage;
