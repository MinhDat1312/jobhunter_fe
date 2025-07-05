import { MailOutlined, ScheduleOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import Header from './client/header.client';
import Footer from './client/footer.client';
import styles from '../styles/app.module.scss';
import { useEffect, useState } from 'react';
import type { MenuProps } from 'antd/lib';
import { useAppSelector } from '../hooks/hook';
import { Outlet, useLocation } from 'react-router-dom';
import { ROLE_LIST } from '../config/utils';
import { Link } from 'react-router-dom';
import NotPermitted from './share/protected-route/not-permitted';
import { isMobile } from 'react-device-detect';

const { Sider, Content } = Layout;

const LayoutProfile = () => {
    const user = useAppSelector((state) => state.account.user);
    const activeRole = user.role.active;

    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState(location.pathname);
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

    useEffect(() => {
        setActiveMenu(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        const fullItems = [
            {
                label: <Link to="/profile">Hồ sơ</Link>,
                key: '/profile',
                icon: <UserOutlined />,
            },
            {
                label: <Link to="/profile/setting">Cài đặt</Link>,
                key: '/profile/setting',
                icon: <SettingOutlined />,
            },
            ...(user?.role?.name !== ROLE_LIST[2].value
                ? []
                : [
                      {
                          label: <Link to="/profile/my-jobs">Việc làm của tôi</Link>,
                          key: '/profile/my-jobs',
                          icon: <ScheduleOutlined />,
                      },
                      {
                          label: <Link to="/profile/subscription">Đăng ký nhận email</Link>,
                          key: '/profile/subscription',
                          icon: <MailOutlined />,
                      },
                  ]),
        ];

        setMenuItems(fullItems);
    }, [user]);

    return (
        <div>
            <Header />
            <Layout
                style={{
                    minHeight: '100vh',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
            >
                {!isMobile && <div style={{ width: '100px' }}></div>}
                <Sider breakpoint="lg" width={280} className={`${styles['sider-app']}`}>
                    <Menu
                        mode="inline"
                        className={styles['menu-app']}
                        selectedKeys={[activeMenu]}
                        items={menuItems}
                        onClick={(e) => setActiveMenu(e.key)}
                    />
                </Sider>
                <Content>{activeRole ? <Outlet /> : <NotPermitted />}</Content>
            </Layout>
            <Footer />
        </div>
    );
};

export default LayoutProfile;
