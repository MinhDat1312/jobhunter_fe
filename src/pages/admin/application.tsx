import { useRef, useState } from 'react';
import DataTable from '../../components/data.table';
import Access from '../../components/share/access';
import { ALL_PERMISSIONS } from '../../config/permissions';
import type { IApplication } from '../../types/backend';
import { ProFormSelect, type ActionType, type ProColumns } from '@ant-design/pro-components';
import { useAppDispatch, useAppSelector } from '../../hooks/hook';
import dayjs from 'dayjs';
import { Space, Grid } from 'antd';
import { EditOutlined, FolderViewOutlined } from '@ant-design/icons';
import { sfIn } from 'spring-filter-query-builder';
import queryString from 'query-string';
import { fetchApplication, fetchApplicationByRecruiter } from '../../redux/slice/applicationSlice';
import ViewDetailApplication from '../../components/admin/application/view.application';
import { ADMIN, colorStatus } from '../../config/utils';
import { useTranslation } from 'react-i18next';

const { useBreakpoint } = Grid;

const ApplicationPage = () => {
    const { t } = useTranslation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;

    const dispatch = useAppDispatch();
    const isFetching = useAppSelector((state) => state.application.isFetching);
    const meta = useAppSelector((state) => state.application.meta);
    const applications = useAppSelector((state) => state.application.result);
    const user = useAppSelector((state) => state.account.user);

    const tableRef = useRef<ActionType>(null);
    const [dataInit, setDataInit] = useState<IApplication | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const columns: ProColumns<IApplication>[] = [
        {
            title: 'Id',
            dataIndex: 'applicationId',
            width: 50,
            render: (_text, record, _index, _action) => {
                return (
                    <a
                        style={{ color: '#00b452' }}
                        href="#"
                        onClick={() => {
                            setOpenViewDetail(true);
                            setDataInit(record);
                        }}
                    >
                        {record.applicationId}
                    </a>
                );
            },
            hideInSearch: true,
        },
        {
            title: t('status'),
            dataIndex: 'status',
            sorter: true,
            render: (_text, record) => {
                const { color, label } = colorStatus(record.status, t);
                return (
                    <p
                        style={{
                            fontWeight: 'bold',
                            marginBottom: 0,
                            color: color,
                        }}
                    >
                        {label}
                    </p>
                );
            },
            renderFormItem: (_item, _props, _form) => (
                <ProFormSelect
                    showSearch
                    mode="multiple"
                    allowClear
                    valueEnum={{
                        PENDING: t('status_application.pending'),
                        ACCEPTED: t('status_application.accepted'),
                        REJECTED: t('status_application.rejected'),
                    }}
                    placeholder={t('choose')}
                />
            ),
        },

        {
            title: t('job'),
            dataIndex: ['job', 'title'],
            hideInSearch: true,
        },
        {
            title: t('recruiter'),
            dataIndex: 'recruiterName',
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
                    <Access permission={ALL_PERMISSIONS.APPLICATIONS.UPDATE} hideChildren>
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                setOpenViewDetail(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access>
                    <a style={{ cursor: 'pointer', margin: '0 10px' }} href={`${entity?.resumeUrl}`} target="_blank">
                        <FolderViewOutlined
                            style={{
                                fontSize: 20,
                                color: '#ff4d4f',
                            }}
                            type=""
                        ></FolderViewOutlined>
                    </a>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any, _filter: any) => {
        const clone = { ...params };
        if (clone?.status?.length) {
            clone.filter = sfIn('status', clone.status).toString();
            delete clone.status;
        }
        clone.page = clone.current;
        clone.size = clone.pageSize;
        delete clone.current;
        delete clone.pageSize;
        let temp = queryString.stringify(clone);

        let sortBy = '';
        if (sort && sort.status) {
            sortBy = sort.status === 'ascend' ? 'sort=status,asc' : 'sort=status,desc';
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

    const reloadTable = () => {
        tableRef?.current?.reload();
    };

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.APPLICATIONS.GET_PAGINATE}>
                <DataTable<IApplication>
                    actionRef={tableRef}
                    headerTitle={t('table.header.application')}
                    rowKey="applicationId"
                    loading={isFetching}
                    columns={columns}
                    dataSource={applications}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        user.role.name === ADMIN
                            ? await dispatch(fetchApplication({ query }))
                            : await dispatch(fetchApplicationByRecruiter({ query }));
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
                                    {range[0]}-{range[1]} / {total} {t('row')}
                                </div>
                            );
                        },
                    }}
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return <></>;
                    }}
                    search={{ span: isTablet ? 12 : 0 }}
                />
            </Access>
            <ViewDetailApplication
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
                isAdmin={user.role.name === ADMIN ? true : false}
                isMobile={isMobile}
            />
        </div>
    );
};

export default ApplicationPage;
