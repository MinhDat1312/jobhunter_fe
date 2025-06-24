import { isMobile } from 'react-device-detect';
import { FaReact } from 'react-icons/fa';
import styles from '../../styles/client.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, ConfigProvider, Drawer, Dropdown, Menu, message, Space, type MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    CodeOutlined,
    ContactsOutlined,
    FireOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    RiseOutlined,
    TwitterOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { callLogout } from '../../config/api';
import { setLogoutAction } from '../../redux/slice/accountSlice';
import ManageAccount from './modal/manage.account';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const user = useAppSelector((state) => state.account.user);

    const [current, setCurrent] = useState('home');
    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location]);

    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang Chủ</Link>,
            key: '/',
            icon: <TwitterOutlined />,
        },
        {
            label: <Link to={'/job'}>Việc Làm</Link>,
            key: '/job',
            icon: <CodeOutlined />,
        },
        {
            label: <Link to={'/recruiter'}>Top Công ty</Link>,
            key: '/recruiter',
            icon: <RiseOutlined />,
        },
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const itemsDropdown = [
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => setOpenManageAccount(true)}>
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
                <div className={styles['container']}>
                    {!isMobile ? (
                        <div style={{ display: 'flex', gap: 30 }}>
                            <div className={styles['brand']}>
                                <FaReact onClick={() => navigate('/')} title="Job Hunter" />
                            </div>
                            <div className={styles['top-menu']}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#ffffff',
                                            colorBgContainer: '#222831',
                                            colorText: '#a7a7a7',
                                        },
                                    }}
                                >
                                    <Menu
                                        style={{
                                            borderBottom: 'none',
                                        }}
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                    />
                                </ConfigProvider>
                                <div className={styles['extra']}>
                                    {isAuthenticated === false ? (
                                        <Link to={'/login'}>Đăng Nhập</Link>
                                    ) : (
                                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
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
                            <span>Your APP</span>
                            <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
                        </div>
                    )}
                </div>
            </div>

            <Drawer title="Chức năng" placement="right" onClose={() => setOpenMobileMenu(false)} open={openMobileMenu}>
                <Menu onClick={onClick} selectedKeys={[current]} mode="vertical" items={itemsMobiles} />
            </Drawer>

            <ManageAccount open={openMangeAccount} onClose={setOpenManageAccount} />
        </>
    );
};

export default Header;
