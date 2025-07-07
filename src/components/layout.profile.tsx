import { MailOutlined, ScheduleOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import Header from './client/header.client';
import Footer from './client/footer.client';
import styles from '../styles/app.module.scss';
import { useEffect, useRef, useState } from 'react';
import type { MenuProps } from 'antd/lib';
import { useAppSelector } from '../hooks/hook';
import { Outlet, useLocation } from 'react-router-dom';
import { ROLE_LIST } from '../config/utils';
import { Link } from 'react-router-dom';
import NotPermitted from './share/protected-route/not-permitted';
import { Grid } from 'antd';
import { useTranslation } from 'react-i18next';

const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const LayoutProfile = () => {
    const { t } = useTranslation();

    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;

    const user = useAppSelector((state) => state.account.user);
    const activeRole = user.role.active;

    const location = useLocation();
    const rootRef = useRef<HTMLDivElement>(null);
    const [activeMenu, setActiveMenu] = useState(location.pathname);
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

    useEffect(() => {
        if (rootRef && rootRef.current) {
            const offsetTop = rootRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: offsetTop - 55,
                behavior: 'smooth',
            });
        }
    }, [location]);

    useEffect(() => {
        setActiveMenu(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        const fullItems = [
            {
                label: <Link to="/profile">{t('profile')}</Link>,
                key: '/profile',
                icon: <UserOutlined />,
            },
            {
                label: <Link to="/profile/setting">{t('setting')}</Link>,
                key: '/profile/setting',
                icon: <SettingOutlined />,
            },
            ...(user?.role?.name !== ROLE_LIST[2].value
                ? []
                : [
                      {
                          label: <Link to="/profile/my-jobs">{t('my_job')}</Link>,
                          key: '/profile/my-jobs',
                          icon: <ScheduleOutlined />,
                      },
                      {
                          label: <Link to="/profile/subscription">{t('subscription_email')}</Link>,
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
                ref={rootRef}
                style={{
                    marginTop: '55px',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
            >
                {!isMobile && !isTablet && <div style={{ width: '100px' }}></div>}
                {isMobile || isTablet ? null : (
                    <Sider breakpoint="lg" width={280} className={`${styles['sider-app']}`}>
                        <Menu
                            mode="inline"
                            className={styles['menu-app']}
                            selectedKeys={[activeMenu]}
                            items={menuItems}
                            onClick={(e) => setActiveMenu(e.key)}
                        />
                    </Sider>
                )}

                <Content>{activeRole ? <Outlet /> : <NotPermitted />}</Content>
            </Layout>
            <Footer />
        </div>
    );
};

export default LayoutProfile;
