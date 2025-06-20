import {
    AliwangwangOutlined,
    ApiOutlined,
    AppstoreOutlined,
    BugOutlined,
    ExceptionOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ScheduleOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, message, Space, type MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { ALL_PERMISSIONS } from '../../config/permissions';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { callLogout } from '../../config/api';
import { setLogoutAction } from '../../redux/slice/accountSlice';

const { Content, Sider } = Layout;

const LayoutAdmin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState(location.pathname);
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

    const dispatch = useAppDispatch();
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
                    label: <Link to="/admin">Dashboard</Link>,
                    key: '/admin',
                    icon: <AppstoreOutlined />,
                },
                ...(viewUser || ACL_ENABLE === 'false'
                    ? [
                          {
                              label: <Link to="/admin/user">User</Link>,
                              key: '/admin/user',
                              icon: <UserOutlined />,
                          },
                      ]
                    : []),
                ...(viewJob || ACL_ENABLE === 'false'
                    ? [
                          {
                              label: <Link to="/admin/job">Job</Link>,
                              key: '/admin/job',
                              icon: <ScheduleOutlined />,
                          },
                      ]
                    : []),

                ...(viewApplication || ACL_ENABLE === 'false'
                    ? [
                          {
                              label: <Link to="/admin/application">Application</Link>,
                              key: '/admin/application',
                              icon: <AliwangwangOutlined />,
                          },
                      ]
                    : []),
                ...(viewRole || ACL_ENABLE === 'false'
                    ? [
                          {
                              label: <Link to="/admin/role">Role</Link>,
                              key: '/admin/role',
                              icon: <ExceptionOutlined />,
                          },
                      ]
                    : []),
            ];

            setMenuItems(full);
        }
    }, [permissions]);

    const itemsDropdown = [
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>
                    Đăng xuất
                </label>
            ),
            key: 'logout',
        },
    ];

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && +res.statusCode === 200) {
            dispatch(setLogoutAction());
            message.success('Đăng xuất thành công');
            navigate('/');
        }
    };

    return (
        <>
            <Layout style={{ minHeight: '100vh' }} className="layout-admin">
                {!isMobile ? (
                    <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                        <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                            <BugOutlined /> ADMIN
                        </div>
                        <Menu
                            selectedKeys={[activeMenu]}
                            mode="inline"
                            items={menuItems}
                            onClick={(e) => setActiveMenu(e.key)}
                        />
                    </Sider>
                ) : (
                    <Menu
                        selectedKeys={[activeMenu]}
                        mode="horizontal"
                        items={menuItems}
                        onClick={(e) => setActiveMenu(e.key)}
                    />
                )}

                <Layout>
                    {!isMobile && (
                        <div
                            className="admin-header"
                            style={{ display: 'flex', justifyContent: 'space-between', marginRight: 20 }}
                        >
                            <Button
                                type="text"
                                icon={
                                    collapsed
                                        ? React.createElement(MenuUnfoldOutlined)
                                        : React.createElement(MenuFoldOutlined)
                                }
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />

                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <Space style={{ cursor: 'pointer' }}>
                                    Welcome {user?.fullName}
                                    <Avatar> {user?.fullName?.substring(0, 2)?.toUpperCase()} </Avatar>
                                </Space>
                            </Dropdown>
                        </div>
                    )}
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default LayoutAdmin;
