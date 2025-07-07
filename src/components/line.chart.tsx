import { Typography } from 'antd';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const { Title } = Typography;

interface IProps {
    title: string;
    data: any;
    dataKey: string;
}

const LineChartStatistics = (props: IProps) => {
    const { title, data, dataKey } = props;
    return (
        <>
            <Title level={4} style={{ textAlign: 'center', marginBottom: 16, color: '#00b452' }}>
                {title}
            </Title>
            <ResponsiveContainer width="100%" height={300} style={{ boxShadow: '0 4px 12px rgba(0, 180, 82, 0.25)' }}>
                <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid stroke="#eeeeee" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Line type="monotone" dataKey={dataKey} stroke="#00b452" />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};

export default LineChartStatistics;
