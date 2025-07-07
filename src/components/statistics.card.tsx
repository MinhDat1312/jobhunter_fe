import { Card, Statistic } from 'antd';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '../config/utils';
import CountUp from 'react-countup';

interface IProps {
    countObject: Record<string, number>;
    title: string;
}

const StatisticsCard = (props: IProps) => {
    const { t } = useTranslation();
    const { countObject, title } = props;

    const formatter = (value: number | string) => {
        return <CountUp end={Number(value)} separator="," />;
    };

    return (
        <Card title={t(title)}>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                {Object.entries(countObject).map(([key, value]) => (
                    <Statistic
                        key={key}
                        title={capitalizeFirstLetter(key.toLowerCase())}
                        value={value}
                        formatter={formatter}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    />
                ))}
            </div>
        </Card>
    );
};

export default StatisticsCard;
