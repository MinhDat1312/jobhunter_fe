import { Tabs } from 'antd';
import type { TabsProps } from 'antd/lib';
import PermissionPage from './permission';
import RolePage from './role';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

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

    return (
        <motion.div initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Tabs defaultActiveKey="1" items={items} />;
        </motion.div>
    );
};

export default RoleTab;
