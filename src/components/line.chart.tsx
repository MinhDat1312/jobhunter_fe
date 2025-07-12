import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

interface IProps {
    title: string;
    categories: number[];
    dataSeries: any[];
    year: number;
    onChangeYear: (year: number) => void;
}

const LineChartStatistics = (props: IProps) => {
    const { t, i18n } = useTranslation();
    const { title, categories, dataSeries, year, onChangeYear } = props;

    const [dashboard, setDashboard] = useState<{ options: any; series: any[] }>({
        options: {},
        series: [],
    });

    useEffect(() => {
        setDashboard({
            options: {
                chart: {
                    id: 'basic-bar',
                    fontFamily: 'Inter, sans-serif',
                },
                title: {
                    text: t(title),
                    style: {
                        fontSize: '20px',
                        color: '#00b452',
                    },
                },
                markers: {
                    size: 5,
                    colors: ['#00b452'],
                    strokeColors: '#ffffff',
                    strokeWidth: 2,
                    shape: 'circle' as 'circle',
                },
                xaxis: {
                    categories: categories,
                    labels: {
                        style: {
                            fontSize: '16px',
                        },
                    },
                },
                yaxis: {
                    labels: {
                        style: {
                            fontSize: '16px',
                        },
                    },
                },
            },
            series: dataSeries,
        });
    }, [i18n.language, dataSeries, categories]);

    return (
        <motion.div
            style={{
                boxShadow: '0 4px 12px rgba(0, 180, 82, 0.3)',
                borderRadius: '8px',
                padding: '16px 0 0 0',
                backgroundColor: '#ffffff',
            }}
            initial={{ scale: 0.5 }}
            whileInView={{ scale: 1 }}
            transition={{
                duration: 0.5,
                ease: 'easeOut',
            }}
        >
            <div style={{ marginBottom: 16, marginRight: 10, textAlign: 'right' }}>
                <DatePicker
                    picker="year"
                    value={dayjs(`${year}`, 'YYYY')}
                    onChange={(date) => {
                        if (date) {
                            onChangeYear(date.year());
                        }
                    }}
                    style={{
                        border: '2px solid #00b452',
                        borderRadius: '6px',
                        padding: '4px 11px',
                    }}
                />
            </div>
            <Chart options={dashboard.options} series={dashboard.series} type="line" width="100%" height={300} />
        </motion.div>
    );
};

export default LineChartStatistics;
