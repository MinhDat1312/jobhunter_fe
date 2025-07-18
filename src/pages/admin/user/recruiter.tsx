import type { ActionType, ProColumns } from '@ant-design/pro-components';
import DataTable from '../../../components/data.table';
import Access from '../../../components/share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import type { IRecruiter } from '../../../types/backend';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import dayjs from 'dayjs';
import { Button, message, notification, Popconfirm, Space } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { callDeleteRecruiter } from '../../../config/api';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';
import { fetchRecruiter } from '../../../redux/slice/recruiterSlice';
import ModalRecruiter from '../../../components/admin/recruiter/modal.recruiter';
import { getRoleName } from '../../../config/utils';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

const RecruiterPage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const meta = useAppSelector((state) => state.recruiter.meta);
    const isFetching = useAppSelector((state) => state.recruiter.isFetching);
    const recruiters = useAppSelector((state) => state.recruiter.result);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IRecruiter | null>(null);
    const tableRef = useRef<ActionType>(null);

    const columns: ProColumns<IRecruiter>[] = [
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
            title: t('recruiter'),
            dataIndex: 'fullName',
            sorter: true,
            search: true,
        },
        {
            title: t('address'),
            dataIndex: 'address',
            sorter: true,
            search: true,
            valueType: 'text',
        },
        {
            title: t('role'),
            dataIndex: ['role', 'name'],
            sorter: true,
            hideInSearch: true,
            render: (_text, record) => {
                return <>{getRoleName(record?.role?.name)}</>;
            },
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
                    <Access permission={ALL_PERMISSIONS.RECRUITERS.UPDATE} hideChildren>
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                setOpenModal(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.RECRUITERS.DELETE} hideChildren>
                        <Popconfirm
                            placement="bottom"
                            title={t('notify.confirm_delete') + ' ' + t('recruiter').toLowerCase()}
                            description={t('notify.description_delete') + ' ' + t('recruiter').toLowerCase() + '?'}
                            onConfirm={() => handleDeleteRecruiter(entity.userId)}
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

    const handleDeleteRecruiter = async (userId: string | undefined) => {
        if (userId) {
            const res = await callDeleteRecruiter(userId);
            if (res && +res.statusCode === 200) {
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

        if (clone.fullName) q.filter = `${sfLike('fullName', clone.fullName)}`;
        if (clone.address) {
            q.filter = clone.fullName
                ? q.filter + ' and ' + `${sfLike('address', clone.address)}`
                : `${sfLike('address', clone.address)}`;
        }

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = '';
        if (sort && sort.fullName) {
            sortBy = sort.fullName === 'ascend' ? 'sort=fullName,asc' : 'sort=fullName,desc';
        }
        if (sort && sort.address) {
            sortBy = sort.address === 'ascend' ? 'sort=address,asc' : 'sort=address,desc';
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
        <motion.div initial={{ opacity: 0, y: 500 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Access permission={ALL_PERMISSIONS.RECRUITERS.GET_PAGINATE}>
                <DataTable<IRecruiter>
                    columns={columns}
                    actionRef={tableRef}
                    headerTitle={t('table.header.recruiter')}
                    rowKey="userId"
                    loading={isFetching}
                    dataSource={recruiters}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        await dispatch(fetchRecruiter({ query }));
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
                        return (
                            <Access permission={ALL_PERMISSIONS.RECRUITERS.CREATE} hideChildren>
                                <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModal(true)}>
                                    {t('button.create')}
                                </Button>
                            </Access>
                        );
                    }}
                    search={{ labelWidth: 'auto' }}
                />
            </Access>
            <ModalRecruiter
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </motion.div>
    );
};

export default RecruiterPage;
