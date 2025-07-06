import { Tabs, type TabsProps } from 'antd';
import RecruiterPage from './recruiter';
import ApplicantPage from './applicant';
import { useTranslation } from 'react-i18next';

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
        <div>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    );
};

export default UserTab;
