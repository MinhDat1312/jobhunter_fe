import { Tabs } from 'antd';
import type { TabsProps } from 'antd/lib';
import PermissionPage from './permission';
import RolePage from './role';

const RoleTab = () => {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Vai trò',
            children: <RolePage />,
        },
        {
            key: '2',
            label: 'Quyền hạn',
            children: <PermissionPage />,
        },
    ];

    return <Tabs defaultActiveKey="1" items={items} />;
};

export default RoleTab;
