import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import type { ICareer } from '../../../types/backend';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { Button, message, notification, Popconfirm, Space } from 'antd';
import Access from '../../../components/share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';
import { callDeleteCareer } from '../../../config/api';
import DataTable from '../../../components/data.table';
import { fetchCareer } from '../../../redux/slice/careerSlice';
import ModalCareer from '../../../components/admin/career/modal.career';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

const CareerPage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isFetching = useAppSelector((state) => state.career.isFetching);
    const meta = useAppSelector((state) => state.career.meta);
    const careers = useAppSelector((state) => state.career.result);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<ICareer | null>(null);
    const tableRef = useRef<ActionType>(null);

    const columns: ProColumns<ICareer>[] = [
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
            title: t('career'),
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: t('table.createdBy'),
            dataIndex: 'createdBy',
            hideInSearch: true,
        },

        {
            title: t('table.updatedBy'),
            dataIndex: 'updatedBy',
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
                    <Access permission={ALL_PERMISSIONS.CAREERS.UPDATE} hideChildren>
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
                    <Access permission={ALL_PERMISSIONS.CAREERS.DELETE} hideChildren>
                        <Popconfirm
                            placement="bottom"
                            title={t('notify.confirm_delete') + ' ' + t('career').toLowerCase()}
                            description={t('notify.description_delete') + ' ' + t('career').toLowerCase() + '?'}
                            onConfirm={() => handleDeleteCareer(entity.careerId)}
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

    const handleDeleteCareer = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteCareer(id);
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

    return (
        <motion.div initial={{ opacity: 0, y: 500 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Access permission={ALL_PERMISSIONS.CAREERS.GET_PAGINATE}>
                <DataTable<ICareer>
                    actionRef={tableRef}
                    headerTitle={t('table.header.career')}
                    rowKey="careerId"
                    loading={isFetching}
                    columns={columns}
                    dataSource={careers}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        await dispatch(fetchCareer({ query }));
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
                            <Access permission={ALL_PERMISSIONS.CAREERS.CREATE} hideChildren>
                                <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModal(true)}>
                                    {t('button.create')}
                                </Button>
                            </Access>
                        );
                    }}
                    search={{ labelWidth: 'auto' }}
                />
                <ModalCareer
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    reloadTable={reloadTable}
                    dataInit={dataInit}
                    setDataInit={setDataInit}
                />
            </Access>
        </motion.div>
    );
};

export default CareerPage;
