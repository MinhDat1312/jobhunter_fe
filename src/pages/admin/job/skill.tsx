import { useRef, useState } from 'react';
import DataTable from '../../../components/data.table';
import type { ISkill } from '../../../types/backend';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import dayjs from 'dayjs';
import { Button, message, notification, Popconfirm, Space } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Access from '../../../components/share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import { callDeleteSkill } from '../../../config/api';
import { fetchSkill } from '../../../redux/slice/skillSlice';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';
import ModalSkill from '../../../components/admin/skill/modal.skill';
import { useTranslation } from 'react-i18next';

const SkillPage = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isFetching = useAppSelector((state) => state.skill.isFetching);
    const meta = useAppSelector((state) => state.skill.meta);
    const skills = useAppSelector((state) => state.skill.result);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<ISkill | null>(null);
    const tableRef = useRef<ActionType>(null);

    const columns: ProColumns<ISkill>[] = [
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
            title: t('skill'),
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
                    <Access permission={ALL_PERMISSIONS.SKILLS.UPDATE} hideChildren>
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
                    <Access permission={ALL_PERMISSIONS.SKILLS.DELETE} hideChildren>
                        <Popconfirm
                            placement="bottom"
                            title={'Xác nhận xóa kỹ năng'}
                            description={'Bạn có chắc chắn muốn xóa kỹ năng này ?'}
                            onConfirm={() => handleDeleteSkill(entity.skillId)}
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

    const handleDeleteSkill = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteSkill(id);
            if (res && +res.statusCode === 200) {
                message.success('Xóa kỹ năng thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message,
                });
            }
        }
    };

    const reloadTable = () => {
        tableRef?.current?.reload();
    };

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.SKILLS.GET_PAGINATE}>
                <DataTable<ISkill>
                    actionRef={tableRef}
                    headerTitle={t('table.header.skill')}
                    rowKey="skillId"
                    loading={isFetching}
                    columns={columns}
                    dataSource={skills}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        await dispatch(fetchSkill({ query }));
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
                                    {range[0]}-{range[1]} trên {total} rows
                                </div>
                            );
                        },
                    }}
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Access permission={ALL_PERMISSIONS.SKILLS.CREATE} hideChildren>
                                <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModal(true)}>
                                    {t('button.create')}
                                </Button>
                            </Access>
                        );
                    }}
                />
                <ModalSkill
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    reloadTable={reloadTable}
                    dataInit={dataInit}
                    setDataInit={setDataInit}
                />
            </Access>
        </div>
    );
};

export default SkillPage;
