import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import type { IPermission } from '../../../types/backend';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { colorMethod } from '../../../config/utils';
import dayjs from 'dayjs';
import Access from '../../../components/share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import DataTable from '../../../components/data.table';
import queryString from 'query-string';
import { fetchPermission } from '../../../redux/slice/permissionSlice';
import ViewDetailPermission from '../../../components/admin/permission/view.permission';
import { Grid } from 'antd';
import { useTranslation } from 'react-i18next';

const { useBreakpoint } = Grid;

const PermissionPage = () => {
    const { t } = useTranslation();
    const screens = useBreakpoint();
    const isTablet = screens.md && !screens.lg;

    const isFetching = useAppSelector((state) => state.permission.isFetching);
    const meta = useAppSelector((state) => state.permission.meta);
    const permissions = useAppSelector((state) => state.permission.result);
    const dispatch = useAppDispatch();

    const [dataInit, setDataInit] = useState<IPermission | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const tableRef = useRef<ActionType>(null);

    const columns: ProColumns<IPermission>[] = [
        {
            title: 'Id',
            dataIndex: 'permissionId',
            width: 50,
            render: (_text, record, _index, _action) => {
                return (
                    <a
                        href="#"
                        onClick={() => {
                            setOpenViewDetail(true);
                            setDataInit(record);
                        }}
                        style={{ color: '#00b452' }}
                    >
                        {record.permissionId}
                    </a>
                );
            },
            hideInSearch: true,
        },
        {
            title: t('permission'),
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: t('api'),
            dataIndex: 'apiPath',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: t('method'),
            dataIndex: 'method',
            sorter: true,
            render(_dom, entity, _index, _action, _schema) {
                return (
                    <p
                        style={{
                            paddingLeft: 10,
                            fontWeight: 'bold',
                            marginBottom: 0,
                            color: colorMethod(entity?.method as string),
                        }}
                    >
                        {entity?.method || ''}
                    </p>
                );
            },
        },
        {
            title: t('module'),
            dataIndex: 'module',
            sorter: true,
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
    ];

    const buildQuery = (params: any, sort: any, _filter: any) => {
        const clone = { ...params };

        let parts = [];
        if (clone.name) parts.push(`name ~ '${clone.name}'`);
        if (clone.method) parts.push(`method ~ '${clone.method}'`);
        if (clone.module) parts.push(`module ~ '${clone.module}'`);

        clone.filter = parts.join(' and ');
        if (!clone.filter) delete clone.filter;

        clone.page = clone.current;
        clone.size = clone.pageSize;

        delete clone.current;
        delete clone.pageSize;
        delete clone.name;
        delete clone.method;
        delete clone.module;

        let temp = queryString.stringify(clone);

        let sortBy = '';
        const fields = ['name', 'method', 'module', 'createdAt', 'updatedAt'];

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

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE}>
                <DataTable<IPermission>
                    actionRef={tableRef}
                    headerTitle={t('table.header.permission')}
                    rowKey="permissionId"
                    loading={isFetching}
                    columns={columns}
                    dataSource={permissions}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        await dispatch(fetchPermission({ query }));
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
                        return <></>;
                    }}
                    search={{
                        span: isTablet ? 12 : 0,
                        labelWidth: 'auto',
                    }}
                />
            </Access>
            <ViewDetailPermission
                onClose={setOpenViewDetail}
                open={openViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    );
};

export default PermissionPage;
