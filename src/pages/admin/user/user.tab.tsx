import { Tabs, type TabsProps } from 'antd';
import RecruiterPage from './recruiter';
import ApplicantPage from './applicant';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

const UserTab = () => {
    const { t } = useTranslation();

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: t('recruiter'),
            children: <RecruiterPage />,
        },
        {
            key: '2',
            label: t('applicant'),
            children: <ApplicantPage />,
        },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Tabs defaultActiveKey="1" items={items} />
        </motion.div>
    );
};

export default UserTab;
