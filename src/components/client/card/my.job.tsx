import { Card, Grid, Tabs, type TabsProps } from 'antd';
import ApplicationApplicant from '../tab/application.applicant';
import SaveJob from '../tab/save.job';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const { useBreakpoint } = Grid;

const MyJob = () => {
    const { t } = useTranslation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;

    const [activeKey, setActiveKey] = useState('application-applicant');

    const items: TabsProps['items'] = [
        {
            key: 'application-applicant',
            label: t('applied'),
            children: <ApplicationApplicant />,
        },
        {
            key: 'saved-job',
            label: t('saved'),
            children: <SaveJob />,
        },
    ];

    return (
        <>
            <Card
                style={{
                    marginBlock: '32px',
                    marginRight: isMobile || isTablet ? '0px' : '100px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Tabs
                    activeKey={activeKey}
                    onChange={(key) => setActiveKey(key)}
                    items={items.map(({ key, label }) => ({ key, label }))}
                />
            </Card>
            {items.find((item) => item.key === activeKey)?.children}
        </>
    );
};

export default MyJob;
