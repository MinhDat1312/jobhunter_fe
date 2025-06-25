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

const RecruiterPage = () => {
    const dispatch = useAppDispatch();
    const meta = useAppSelector((state) => state.recruiter.meta);
    const isFetching = useAppSelector((state) => state.recruiter.isFetching);
    const recruiters = useAppSelector((state) => state.recruiter.result);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IRecruiter | null>(null);
    const tableRef = useRef<ActionType>(null);

    const columns: ProColumns<IRecruiter>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: 'center',
            render: (_text, _record, index) => {
                return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>;
            },
            hideInSearch: true,
        },
        {
            title: 'Nhà tuyển dụng',
            dataIndex: 'fullName',
            sorter: true,
            search: true,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            sorter: true,
            search: true,
            valueType: 'text',
        },
        {
            title: 'Vai trò',
            dataIndex: ['role', 'name'],
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (_text, record, _index, _action) => {
                return <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ''}</>;
            },
            hideInSearch: true,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (_text, record, _index, _action) => {
                return <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ''}</>;
            },
            hideInSearch: true,
        },
        {
            title: 'Hành động',
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
                            placement="leftTop"
                            title={'Xác nhận xóa nhà tuyển dụng'}
                            description={'Bạn có chắc chắn muốn xóa nhà tuyển dụng này ?'}
                            onConfirm={() => handleDeleteRecruiter(entity.userId)}
                            okText="Xác nhận"
                            cancelText="Hủy"
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
                message.success('Xóa nhà tuyển dụng thành công');
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
        <div>
            <Access permission={ALL_PERMISSIONS.RECRUITERS.GET_PAGINATE}>
                <DataTable<IRecruiter>
                    columns={columns}
                    actionRef={tableRef}
                    headerTitle="Danh sách nhà tuyển dụng"
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
                        showTotal: (total, range) => {
                            return (
                                <div>
                                    {' '}
                                    {range[0]}-{range[1]} trên {total} hàng
                                </div>
                            );
                        },
                    }}
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Access permission={ALL_PERMISSIONS.RECRUITERS.CREATE} hideChildren>
                                <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModal(true)}>
                                    Thêm mới
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
        </div>
    );
};

export default RecruiterPage;
