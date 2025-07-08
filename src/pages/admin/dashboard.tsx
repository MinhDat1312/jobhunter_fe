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
import { useAppSelector } from '../../hooks/hook';
import { ROLE_LIST } from '../../config/utils';
import queryString from 'query-string';

const DashboardPage = () => {
    const { t, i18n } = useTranslation();
    const user = useAppSelector((state) => state.account.user);

    const [countUser, setCountUser] = useState<Record<string, number>>({});
    const [countJob, setCountJob] = useState<Record<string, number>>({});
    const [countApplication, setCountApplication] = useState<Record<string, number>>({});
    const [year, setYear] = useState(new Date(Date.now()).getFullYear());
    const [_countApplicationYear, setCountApplicationYear] = useState<Record<number, number>>({});
    const [categories, setCategories] = useState<any[]>([]);
    const [series, setSeries] = useState<{ name: string; data: number[]; color: string }[]>([]);

    useEffect(() => {
        const init = async () => {
            const res = await callStatisticsApplicationByYear(year, buildQuery('job.recruiter.fullName'));

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
                callStatisticsJob(buildQuery('recruiter.fullName')),
                callStatisticsApplication(buildQuery('job.recruiter.fullName')),
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

    const buildQuery = (query: string) => {
        const clone: Record<string, any> = {};
        let parts = [];

        if (user.role.name !== ROLE_LIST[0].value) parts.push(`${query} ~ '${user.fullName}'`);
        clone.filter = parts.join(' and ');
        if (!clone.filter) delete clone.filter;

        let temp = queryString.stringify(clone);

        return temp;
    };

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
