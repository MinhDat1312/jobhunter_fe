import { motion } from 'motion/react';
import Access from '../../components/share/access';
import { ALL_PERMISSIONS } from '../../config/permissions';
import DataTable from '../../components/data.table';
import type { IBlog } from '../../types/backend';
import { Button, Grid, message, notification, Popconfirm, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hook';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { callDeleteBlog } from '../../config/api';
import { ROLE_LIST } from '../../config/utils';
import queryString from 'query-string';
import { fetchBlog } from '../../redux/slice/blogSlice';

const { useBreakpoint } = Grid;

const BlogPage = () => {
    const { t } = useTranslation();
    const screens = useBreakpoint();
    const isTablet = screens.md && !screens.lg;

    const dispatch = useAppDispatch();
    const isFetching = useAppSelector((state) => state.blog.isFetching);
    const meta = useAppSelector((state) => state.blog.meta);
    const blogs = useAppSelector((state) => state.blog.result);
    const user = useAppSelector((state) => state.account.user);

    const tableRef = useRef<ActionType>(null);
    const navigate = useNavigate();

    const columns: ProColumns<IBlog>[] = [
        {
            title: t('table.no_1'),
            key: 'index',
            width: 50,
            align: 'center',
            render: (_text, _record, index) => {
                return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>;
            },
            hideInSearch: true,
        },
        {
            title: t('table.blog_table.author'),
            dataIndex: ['author', 'fullName'],
            width: 200,
            sorter: true,
        },
        {
            title: t('table.blog_table.title'),
            dataIndex: 'title',
            width: 200,
            sorter: true,
        },
        {
            title: t('status'),
            dataIndex: 'draft',
            width: 100,
            render(_dom, entity, _index, _action, _schema) {
                return (
                    <>
                        <Tag color={entity.draft ? 'red' : 'lime'} style={{ fontSize: '14px' }}>
                            {entity.draft ? t('table.blog_table.draft') : t('table.blog_table.publish')}
                        </Tag>
                    </>
                );
            },
            hideInSearch: true,
        },

        {
            title: t('table.createdAt'),
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (_text, record, _index, _action) => {
                return <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ''}</>;
            },
            hideInSearch: true,
        },
        {
            title: t('table.updatedAt'),
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (_text, record, _index, _action) => {
                return <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ''}</>;
            },
            hideInSearch: true,
        },
        {
            title: t('table.action'),
            hideInSearch: true,
            width: 100,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.BLOGS.UPDATE} hideChildren>
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                navigate(`/admin/blog/upsert?id=${entity.blogId}`);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.BLOGS.DELETE} hideChildren>
                        <Popconfirm
                            placement="bottom"
                            title={t('notify.confirm_delete') + ' ' + t('blog').toLowerCase()}
                            description={t('notify.description_delete') + ' ' + t('blog').toLowerCase() + '?'}
                            onConfirm={() => handleDeleteBlog(entity.blogId)}
                            okText={t('button.confirm')}
                            cancelText={t('button.cancel')}
                        >
                            <span style={{ cursor: 'pointer', margin: '0 10px' }}>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 20,
                                        color: '#ff4d4f',
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any, _filter: any) => {
        const clone = { ...params };
        let parts = [];
        if (user.role.name !== ROLE_LIST[0].value) parts.push(`author.fullName ~ '${user.fullName}'`);
        if (clone.title) parts.push(`title ~ '${clone.title}'`);
        if (clone.author?.fullName) parts.push(`author.fullName ~ '${clone.author.fullName}'`);

        clone.filter = parts.join(' and ');
        if (!clone.filter) delete clone.filter;

        clone.page = clone.current;
        clone.size = clone.pageSize;

        delete clone.current;
        delete clone.pageSize;
        delete clone.title;
        delete clone.author;

        let temp = queryString.stringify(clone);

        let sortBy = '';
        const fields = ['title', 'author.fullName', 'createdAt', 'updatedAt'];
        if (sort) {
            for (const field of fields) {
                if (sort[field]) {
                    sortBy = `sort=${field},${sort[field] === 'ascend' ? 'asc' : 'desc'}`;
                    break;
                }
            }
        }

        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    };

    const handleDeleteBlog = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteBlog(id);
            if (res && res.data) {
                message.success(t('notify.success_delete'));
                reloadTable();
            } else {
                notification.error({
                    message: t('notify.error'),
                    description: res.message,
                });
            }
        }
    };

    const reloadTable = () => {
        tableRef?.current?.reload();
    };

    return (
        <motion.div initial={{ opacity: 0, y: 500 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Access permission={ALL_PERMISSIONS.BLOGS.GET_PAGINATE}>
                <DataTable<IBlog>
                    actionRef={tableRef}
                    headerTitle={t('table.header.blog')}
                    rowKey="blogId"
                    loading={isFetching}
                    columns={columns}
                    dataSource={blogs}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        await dispatch(fetchBlog({ query }));
                    }}
                    scroll={{ x: true }}
                    pagination={{
                        current: meta.page,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showLessItems: true,
                        showTotal: (total, range) => {
                            return (
                                <div>
                                    {' '}
                                    {range[0]}-{range[1]} / {total} rows
                                </div>
                            );
                        },
                    }}
                    search={{
                        span: isTablet ? 12 : 0,
                    }}
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Access permission={ALL_PERMISSIONS.BLOGS.CREATE} hideChildren>
                                <Button icon={<PlusOutlined />} type="primary" onClick={() => navigate('upsert')}>
                                    {t('button.create')}
                                </Button>
                            </Access>
                        );
                    }}
                />
            </Access>
        </motion.div>
    );
};

export default BlogPage;
