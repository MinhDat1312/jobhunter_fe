import {
    AliwangwangOutlined,
    AppstoreOutlined,
    ExceptionOutlined,
    LoginOutlined,
    MenuUnfoldOutlined,
    ScheduleOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Avatar, Layout, Menu, Space, Grid, type MenuProps, Image, message } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hook';
import { ALL_PERMISSIONS } from '../../config/permissions';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { callLogout } from '../../config/api';
import { setLogoutAction } from '../../redux/slice/accountSlice';
import DrawerCustom from '../client/drawer.client';
import styles from '../../styles/app.module.scss';
import stylesAdmin from '../../styles/admin.module.scss';
import { useTranslation } from 'react-i18next';
import LanguageButton from '../language.button';

const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const LayoutAdmin = () => {
    const { t, i18n } = useTranslation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;
    const isDesktop = !isMobile && !isTablet;

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState(location.pathname);
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);
    const [openMobileMenuLeft, setOpenMobileMenuLeft] = useState<boolean>(false);

    const permissions = useAppSelector((state) => state.account.user.role.permissions);
    const user = useAppSelector((state) => state.account.user);

    useEffect(() => {
        setActiveMenu(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        const ACL_ENABLE = import.meta.env.VITE_ACL_ENABLE;
        if (permissions?.length || ACL_ENABLE === 'false') {
            const viewUser = permissions?.find(
                (item) =>
                    item.apiPath === ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath &&
                    item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method,
            );

            const viewJob = permissions?.find(
                (item) =>
                    item.apiPath === ALL_PERMISSIONS.JOBS.GET_PAGINATE.apiPath &&
                    item.method === ALL_PERMISSIONS.JOBS.GET_PAGINATE.method,
            );

            const viewApplication = permissions?.find(
                (item) =>
                    item.apiPath === ALL_PERMISSIONS.APPLICATIONS.GET_PAGINATE.apiPath &&
                    item.method === ALL_PERMISSIONS.APPLICATIONS.GET_PAGINATE.method,
            );

            const viewRole = permissions?.find(
                (item) =>
                    item.apiPath === ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath &&
                    item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method,
            );

            const full = [
                {
                    label: <Link to="/admin">{t('dashboard')}</Link>,
                    key: '/admin',
                    icon: <AppstoreOutlined />,
                },
                ...(viewUser || ACL_ENABLE === 'false'
                    ? [
                          {
                              label: <Link to="/admin/user">{t('user')}</Link>,
                              key: '/admin/user',
                              icon: <UserOutlined />,
                          },
                      ]
                    : []),
                ...(viewJob || ACL_ENABLE === 'false'
                    ? [
                          {
                              label: <Link to="/admin/job">{t('job')}</Link>,
                              key: '/admin/job',
                              icon: <ScheduleOutlined />,
                          },
                      ]
                    : []),

                ...(viewApplication || ACL_ENABLE === 'false'
                    ? [
                          {
                              label: <Link to="/admin/application">{t('application')}</Link>,
                              key: '/admin/application',
                              icon: <AliwangwangOutlined />,
                          },
                      ]
                    : []),
                ...(viewRole || ACL_ENABLE === 'false'
                    ? [
                          {
                              label: <Link to="/admin/role">{t('role')}</Link>,
                              key: '/admin/role',
                              icon: <ExceptionOutlined />,
                          },
                      ]
                    : []),
                {
                    label: <span onClick={handleLogout}>{t('logout')}</span>,
                    key: '/logout',
                    icon: <LoginOutlined />,
                },
            ];

            setMenuItems(full);
        }
    }, [permissions, i18n.language]);

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && +res.statusCode === 200) {
            dispatch(setLogoutAction());
            message.success(t('notify.logout'));
            navigate('/');
        }
    };

    return (
        <>
            <Layout style={{ minHeight: '100vh' }} className="layout-admin">
                {isDesktop ? (
                    <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                        <div
                            style={{
                                height: 32,
                                margin: 16,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                            onClick={() => navigate('/')}
                        >
                            <Image width={100} src={logo} alt="Job Hunter" preview={false} />
                        </div>
                        <Menu
                            className={styles['menu-app']}
                            selectedKeys={[activeMenu]}
                            mode="inline"
                            items={menuItems}
                            onClick={(e) => setActiveMenu(e.key)}
                        />
                    </Sider>
                ) : (
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            height: '55px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <MenuUnfoldOutlined
                            style={{ fontSize: '24px', color: '#00b452', marginLeft: '16px' }}
                            onClick={() => setOpenMobileMenuLeft(true)}
                        />
                        <div className={stylesAdmin['brand']} onClick={() => navigate('/')}>
                            <Image width={100} src={logo} alt="Job Hunter" preview={false} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <LanguageButton />
                            <Space
                                style={{
                                    marginRight: 16,
                                    color: '#37434f',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                }}
                            >
                                {user?.fullName.toUpperCase()}
                            </Space>
                        </div>
                    </div>
                )}
                <Layout>
                    {isDesktop && (
                        <div
                            className="admin-header"
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                gap: '8px',
                                margin: 20,
                            }}
                        >
                            <LanguageButton />
                            <Space
                                style={{
                                    color: '#37434f',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Welcome {user?.fullName}
                                <Avatar> {user?.fullName?.substring(0, 2)?.toUpperCase()} </Avatar>
                            </Space>
                        </div>
                    )}
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                </Layout>

                <DrawerCustom
                    placement="left"
                    open={openMobileMenuLeft}
                    onClose={() => setOpenMobileMenuLeft(false)}
                    onMenuClick={(e) => {
                        setActiveMenu(e.key);
                        setOpenMobileMenuLeft(false);
                    }}
                    selectedKey={activeMenu}
                    menuItems={menuItems}
                    titleText={t('button.close')}
                />
            </Layout>
        </>
    );
};

export default LayoutAdmin;
