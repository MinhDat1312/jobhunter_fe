import styles from '../../styles/client.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, ConfigProvider, Dropdown, Image, Menu, message, Space, type MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ContactsOutlined,
    FireOutlined,
    FundOutlined,
    HomeOutlined,
    LogoutOutlined,
    MailOutlined,
    MenuUnfoldOutlined,
    ScheduleOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/hook';
import { callLogout } from '../../config/api';
import { setLogoutAction } from '../../redux/slice/accountSlice';
import logo from '../../assets/images/logo.png';
import DrawerCustom from './drawer.client';
import { Grid } from 'antd';
import { ROLE_LIST } from '../../config/utils';
import { useTranslation } from 'react-i18next';
const { useBreakpoint } = Grid;

const Header = () => {
    const { t } = useTranslation();

    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;

    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const user = useAppSelector((state) => state.account.user);

    const [current, setCurrent] = useState(location.pathname);
    const [openMobileMenuLeft, setOpenMobileMenuLeft] = useState<boolean>(false);
    const [openMobileMenuRight, setOpenMobileMenuRight] = useState<boolean>(false);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location.pathname]);

    const itemsLeft: MenuProps['items'] = [
        {
            label: <Link to={'/'}>{t('home')}</Link>,
            key: '/',
            icon: <HomeOutlined />,
        },
        {
            label: <Link to={'/job'}>{t('job')}</Link>,
            key: '/job',
            icon: <ScheduleOutlined />,
        },
        {
            label: <Link to={'/recruiter'}>{t('top_recruiter')}</Link>,
            key: '/recruiter',
            icon: <FundOutlined />,
        },
    ];

    const itemsRight: MenuProps['items'] = [
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
        ...(user.role?.permissions?.length && user.role?.active && user.role?.name !== 'APPLICANT'
            ? [
                  {
                      label: <Link to={'/admin'}>{t('manage_admin')}</Link>,
                      key: '/admin',
                      icon: <FireOutlined />,
                  },
              ]
            : []),
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                    {t('logout')}
                </label>
            ),
            key: 'logout',
            icon: <LogoutOutlined />,
        },
    ];

    const itemsDropdown = [
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                    {t('manage_account')}
                </label>
            ),
            key: '/profile',
            icon: <ContactsOutlined />,
        },

        ...(user.role?.permissions?.length && user.role?.active && user.role?.name !== 'APPLICANT'
            ? [
                  {
                      label: <Link to={'/admin'}> {t('manage_admin')}</Link>,
                      key: '/admin',
                      icon: <FireOutlined />,
                  },
              ]
            : []),

        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                    {t('logout')}
                </label>
            ),
            key: 'logout',
            icon: <LogoutOutlined />,
        },
    ];

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res && +res.statusCode === 200) {
            dispatch(setLogoutAction());
            message.success(t('notify.logout'));
            navigate('/');
        }
    };

    return (
        <>
            <div className={styles['header-section']}>
                <div className={`${styles.container} ${styles.nav}`}>
                    {isMobile || isTablet ? (
                        <div className={styles['header-mobile']}>
                            <MenuUnfoldOutlined
                                style={{ fontSize: '24px', color: '#00b452' }}
                                onClick={() => setOpenMobileMenuLeft(true)}
                            />
                            <div className={styles['brand']} onClick={() => navigate('/')}>
                                <Image width={100} src={logo} alt="Job Hunter" preview={false} />
                            </div>
                            {isAuthenticated === false ? (
                                <Link
                                    to={'/login'}
                                    style={{
                                        cursor: 'pointer',
                                        display: 'block',
                                        color: '#00b452',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {t('sign_in')}
                                </Link>
                            ) : (
                                <Avatar src={`${user.avatar}`} onClick={() => setOpenMobileMenuRight(true)}>
                                    {!user?.avatar && user?.username?.substring(0, 2)?.toUpperCase()}
                                </Avatar>
                            )}
                        </div>
                    ) : (
                        <div
                            style={{
                                height: 55,
                                display: 'flex',
                                gap: 30,
                            }}
                        >
                            <div className={styles['brand']} onClick={() => navigate('/')}>
                                <Image width={100} src={logo} alt="Job Hunter" preview={false} />
                            </div>
                            <div className={styles['top-menu']}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#00b452',
                                            colorBgContainer: '#ffffff',
                                            colorText: '#37434f',
                                        },
                                    }}
                                >
                                    <Menu selectedKeys={[current]} mode="horizontal" items={itemsLeft} />
                                </ConfigProvider>
                                <div className={styles['extra']}>
                                    {isAuthenticated === false ? (
                                        <Link to={'/login'}>{t('sign_in')}</Link>
                                    ) : (
                                        <Dropdown menu={{ items: itemsDropdown }} trigger={['hover']}>
                                            <Space style={{ cursor: 'pointer' }}>
                                                <span>
                                                    {t('welcome')} {user?.username}
                                                </span>
                                                <Avatar src={`${user.avatar}`}>
                                                    {!user?.avatar && user?.username?.substring(0, 2)?.toUpperCase()}
                                                </Avatar>
                                            </Space>
                                        </Dropdown>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <DrawerCustom
                placement="left"
                open={openMobileMenuLeft}
                onClose={() => setOpenMobileMenuLeft(false)}
                onMenuClick={(e) => {
                    setCurrent(e.key);
                    setOpenMobileMenuLeft(false);
                }}
                selectedKey={current}
                menuItems={itemsLeft}
                titleText={t('button.close')}
            />

            <DrawerCustom
                placement="right"
                open={openMobileMenuRight}
                onClose={() => setOpenMobileMenuRight(false)}
                onMenuClick={(e) => {
                    setCurrent(e.key);
                    setOpenMobileMenuRight(false);
                }}
                selectedKey={current}
                menuItems={itemsRight}
                showUsername
                username={user?.username}
            />
        </>
    );
};

export default Header;
