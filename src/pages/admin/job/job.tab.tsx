import { Tabs, type TabsProps } from 'antd';
import JobPage from './job';
import SkillPage from './skill';
import CareerPage from './career';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

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

    return (
        <motion.div initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Tabs defaultActiveKey="1" items={items} />;
        </motion.div>
    );
};

export default JobTab;
