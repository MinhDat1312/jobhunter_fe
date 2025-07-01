import styles from '../../styles/client.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, ConfigProvider, Drawer, Dropdown, Image, Menu, message, Space, type MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    CloseOutlined,
    ContactsOutlined,
    FireOutlined,
    FundOutlined,
    HomeOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    ScheduleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/hook';
import { callLogout } from '../../config/api';
import { setLogoutAction } from '../../redux/slice/accountSlice';
import logo from '../../assets/images/logo.png';
import { Grid } from 'antd';
const { useBreakpoint } = Grid;

const Header = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;

    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const user = useAppSelector((state) => state.account.user);

    const [current, setCurrent] = useState(location.pathname);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location.pathname]);

    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: '/',
            icon: <HomeOutlined />,
        },
        {
            label: <Link to={'/job'}>Việc làm</Link>,
            key: '/job',
            icon: <ScheduleOutlined />,
        },
        {
            label: <Link to={'/recruiter'}>Top công ty</Link>,
            key: '/recruiter',
            icon: <FundOutlined />,
        },
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        setOpenMobileMenu(false);
    };

    const itemsDropdown = [
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                    Quản lý tài khoản
                </label>
            ),
            key: '/profile',
            icon: <ContactsOutlined />,
        },

        ...(user.role?.permissions?.length && user.role?.active && user.role?.name !== 'APPLICANT'
            ? [
                  {
                      label: <Link to={'/admin'}>Trang Quản Trị</Link>,
                      key: '/admin',
                      icon: <FireOutlined />,
                  },
              ]
            : []),

        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                    Đăng xuất
                </label>
            ),
            key: 'logout',
            icon: <LogoutOutlined />,
        },
    ];

    const itemsMobiles = [...items, ...itemsDropdown];

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res && +res.statusCode === 200) {
            dispatch(setLogoutAction());
            message.success('Đăng xuất thành công');
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
                                onClick={() => setOpenMobileMenu(true)}
                            />
                            <div className={styles['brand']} onClick={() => navigate('/')}>
                                <Image width={100} src={logo} alt="Job Hunter" preview={false} />
                            </div>
                            <Avatar src={`${user.avatar}`}>
                                {!user?.avatar && user?.username?.substring(0, 2)?.toUpperCase()}
                            </Avatar>
                        </div>
                    ) : (
                        <div style={{ height: 55, display: 'flex', gap: 30 }}>
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
                                    <Menu selectedKeys={[current]} mode="horizontal" items={items} />
                                </ConfigProvider>
                                <div className={styles['extra']}>
                                    {isAuthenticated === false ? (
                                        <Link to={'/login'}>Đăng nhập</Link>
                                    ) : (
                                        <Dropdown menu={{ items: itemsDropdown }} trigger={['hover']}>
                                            <Space style={{ cursor: 'pointer' }}>
                                                <span>Welcome {user?.username}</span>
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

            <Drawer
                title={
                    <div
                        style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                        onClick={() => setOpenMobileMenu(false)}
                    >
                        <span style={{ marginLeft: 'auto', marginRight: '12px' }}>Đóng</span>
                    </div>
                }
                closeIcon={false}
                extra={
                    <CloseOutlined
                        onClick={() => setOpenMobileMenu(false)}
                        style={{ fontSize: 20, cursor: 'pointer', color: '#00b452' }}
                    />
                }
                placement="left"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu onClick={onClick} selectedKeys={[current]} mode="vertical" items={itemsMobiles} />
            </Drawer>
        </>
    );
};

export default Header;
