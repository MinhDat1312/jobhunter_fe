import { Tabs } from 'antd';
import type { TabsProps } from 'antd/lib';
import PermissionPage from './permission';
import RolePage from './role';
import { useTranslation } from 'react-i18next';

const RoleTab = () => {
    const { t } = useTranslation();
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: t('role'),
            children: <RolePage />,
        },
        {
            key: '2',
            label: t('permission'),
            children: <PermissionPage />,
        },
    ];

    return <Tabs defaultActiveKey="1" items={items} />;
};

export default RoleTab;
