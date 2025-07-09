import { Card, Grid, Tabs, type TabsProps } from 'antd';
import ApplicationApplicant from '../tab/application.applicant';
import SaveJob from '../tab/save.job';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../hooks/hook';
import { ROLE_LIST } from '../../../config/utils';

const { useBreakpoint } = Grid;

const MyJob = () => {
    const { t } = useTranslation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;

    const user = useAppSelector((state) => state.account.user);
    const [activeKey, setActiveKey] = useState(
        `${user.role.name === ROLE_LIST[1].value ? 'saved-job' : 'application-applicant'}`,
    );

    const items: TabsProps['items'] = [
        ...(user.role.name !== ROLE_LIST[1].value
            ? [
                  {
                      key: 'application-applicant',
                      label: t('applied'),
                      children: <ApplicationApplicant />,
                  },
              ]
            : []),

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
