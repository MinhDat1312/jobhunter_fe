import { Tabs, type TabsProps } from 'antd';
import JobPage from './job';
import SkillPage from './skill';
import CareerPage from './career';
import { useTranslation } from 'react-i18next';

const JobTab = () => {
    const { t } = useTranslation();
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: t('job'),
            children: <JobPage />,
        },
        {
            key: '2',
            label: t('skill'),
            children: <SkillPage />,
        },
        {
            key: '3',
            label: t('career'),
            children: <CareerPage />,
        },
    ];

    return <Tabs defaultActiveKey="1" items={items} />;
};

export default JobTab;
