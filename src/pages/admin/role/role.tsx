import { useEffect, useRef, useState } from 'react';
import DataTable from '../../../components/data.table';
import Access from '../../../components/share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import type { IPermission, IRole } from '../../../types/backend';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, message, notification, Popconfirm, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { callDeleteRole, callFetchPermission } from '../../../config/api';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';
import { fetchRole } from '../../../redux/slice/roleSlice';
import { getRoleName, groupByPermission } from '../../../config/utils';
import ModalRole from '../../../components/admin/role/modal.role';
import { useTranslation } from 'react-i18next';

const RolePage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isFetching = useAppSelector((state) => state.role.isFetching);
    const meta = useAppSelector((state) => state.role.meta);
    const roles = useAppSelector((state) => state.role.result);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const tableRef = useRef<ActionType>(null);

    const [singleRole, setSingleRole] = useState<IRole | null>(null);
    const [listPermissions, setListPermissions] = useState<
        | {
              module: string;
              permissions: IPermission[];
          }[]
        | null
    >(null);

    useEffect(() => {
        const init = async () => {
            const res = await callFetchPermission(`page=1&size=100`);
            if (res.data?.result) {
                setListPermissions(groupByPermission(res.data?.result));
            }
        };

        init();
    }, []);

    const columns: ProColumns<IRole>[] = [
        {
            title: 'Id',
            dataIndex: 'roleId',
            render: (_text, record, _index, _action) => {
                return <span>{record.roleId}</span>;
            },
            hideInSearch: true,
        },
        {
            title: t('role'),
            dataIndex: 'name',
            sorter: true,
            render(_dom, entity, _index, _action, _schema) {
                return <>{getRoleName(entity.name)}</>;
            },
        },
        {
            title: t('status'),
            dataIndex: 'active',
            render(_dom, entity, _index, _action, _schema) {
                return (
                    <>
                        <Tag color={entity.active ? 'lime' : 'red'} style={{ fontSize: '14px' }}>
                            {entity.active ? t('button.active_tag') : t('button.inactive_tag')}
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
                    <Access permission={ALL_PERMISSIONS.ROLES.UPDATE} hideChildren>
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                setSingleRole(entity);
                                setOpenModal(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.ROLES.DELETE} hideChildren>
                        <Popconfirm
                            placement="bottom"
                            title={t('notify.confirm_delete') + ' ' + t('role').toLowerCase()}
                            description={t('notify.description_delete') + ' ' + t('role').toLowerCase() + '?'}
                            onConfirm={() => handleDeleteRole(entity.roleId)}
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

    const handleDeleteRole = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteRole(id);
            if (res && res.statusCode === 200) {
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

    const buildQuery = (params: any, sort: any, _filter: any) => {
        const clone = { ...params };
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: '',
        };

        if (clone.name) q.filter = `${sfLike('name', clone.name)}`;

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = '';
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? 'sort=name,asc' : 'sort=name,desc';
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? 'sort=createdAt,asc' : 'sort=createdAt,desc';
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? 'sort=updatedAt,asc' : 'sort=updatedAt,desc';
        }

        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    };

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.ROLES.GET_PAGINATE}>
                <DataTable<IRole>
                    actionRef={tableRef}
                    headerTitle={t('table.header.role')}
                    rowKey="roleId"
                    loading={isFetching}
                    columns={columns}
                    dataSource={roles}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        await dispatch(fetchRole({ query }));
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
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModal(true)}>
                                {t('button.create')}
                            </Button>
                        );
                    }}
                />
            </Access>
            <ModalRole
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                listPermissions={listPermissions!}
                singleRole={singleRole}
                setSingleRole={setSingleRole}
            />
        </div>
    );
};

export default RolePage;
