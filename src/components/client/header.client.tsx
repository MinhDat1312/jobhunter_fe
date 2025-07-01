import { isMobile } from 'react-device-detect';
import styles from '../../styles/client.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, ConfigProvider, Drawer, Dropdown, Image, Menu, message, Space, type MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContactsOutlined, FireOutlined, LogoutOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/hook';
import { callLogout } from '../../config/api';
import { setLogoutAction } from '../../redux/slice/accountSlice';
import logo from '../../assets/images/logo.png';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const user = useAppSelector((state) => state.account.user);

    const [current, setCurrent] = useState('home');
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location]);

    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: '/',
        },
        {
            label: <Link to={'/job'}>Việc làm</Link>,
            key: '/job',
        },
        {
            label: <Link to={'/recruiter'}>Top công ty</Link>,
            key: '/recruiter',
        },
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const itemsDropdown = [
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                    Quản lý tài khoản
                </label>
            ),
            key: 'manage-account',
            icon: <ContactsOutlined />,
        },

        ...(user.role?.permissions?.length && user.role?.active && user.role?.name !== 'APPLICANT'
            ? [
                  {
                      label: <Link to={'/admin'}>Trang Quản Trị</Link>,
                      key: 'admin',
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
                    {!isMobile ? (
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
                                    <Menu
                                        style={{
                                            borderBottom: 'none',
                                            fontSize: '15px',
                                            fontWeight: 'bold',
                                            width: '100%',
                                        }}
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                    />
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
                    ) : (
                        <div className={styles['header-mobile']}>
                            <span>Job Hunter</span>
                            <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
                        </div>
                    )}
                </div>
            </div>

            <Drawer title="Chức năng" placement="right" onClose={() => setOpenMobileMenu(false)} open={openMobileMenu}>
                <Menu onClick={onClick} selectedKeys={[current]} mode="vertical" items={itemsMobiles} />
            </Drawer>
        </>
    );
};

export default Header;
