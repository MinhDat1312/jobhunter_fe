import styles from '../../styles/client.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, ConfigProvider, Dropdown, Image, Menu, message, Space, type MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BellOutlined,
    ContactsOutlined,
    FireOutlined,
    FundOutlined,
    HomeOutlined,
    LogoutOutlined,
    MailOutlined,
    MenuUnfoldOutlined,
    ReadOutlined,
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
import { useTranslation } from 'react-i18next';
import LanguageButton from '../language.button';
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
        {
            label: <Link to={'/blog'}>{t('blog')}</Link>,
            key: '/blog',
            icon: <ReadOutlined />,
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

    useEffect(() => {
        const active = itemsLeft
            ?.filter((item) => location.pathname.startsWith(item?.key as string))
            ?.sort(
                (a, b) =>
                    (typeof b?.key === 'string' ? b.key.length : 0) - (typeof a?.key === 'string' ? a.key.length : 0),
            );
        setCurrent(active?.[0]?.key as string);
    }, [location.pathname, itemsLeft]);

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
                            <div
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}
                            >
                                <LanguageButton />
                                <BellOutlined style={{ fontSize: '24px', color: '#00b452' }} />
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
                                    <LanguageButton />
                                    <BellOutlined style={{ fontSize: '24px', color: '#00b452' }} />
                                    {isAuthenticated === false ? (
                                        <Link to={'/login'}>{t('sign_in')}</Link>
                                    ) : (
                                        <Dropdown menu={{ items: itemsDropdown }} trigger={['hover']}>
                                            <Space style={{ cursor: 'pointer' }}>
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
