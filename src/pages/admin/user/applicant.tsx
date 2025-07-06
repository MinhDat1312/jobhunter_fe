import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import type { IApplicant } from '../../../types/backend';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { Button, message, notification, Popconfirm, Space } from 'antd';
import Access from '../../../components/share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { callDeleteApplicant } from '../../../config/api';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';
import DataTable from '../../../components/data.table';
import { fetchApplicant } from '../../../redux/slice/applicantSlice';
import ModalApplicant from '../../../components/admin/applicant/modal.applicant';

const ApplicantPage = () => {
    const dispatch = useAppDispatch();
    const meta = useAppSelector((state) => state.applicant.meta);
    const isFetching = useAppSelector((state) => state.applicant.isFetching);
    const applicants = useAppSelector((state) => state.applicant.result);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IApplicant | null>(null);
    const tableRef = useRef<ActionType>(null);

    const columns: ProColumns<IApplicant>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: 'center',
            render: (_text, _record, index) => {
                return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>;
            },
            hideInSearch: true,
            responsive: ['sm', 'md', 'lg'],
        },
        {
            title: 'Ứng viên',
            dataIndex: 'fullName',
            sorter: true,
            search: true,
            responsive: ['xs', 'sm', 'md', 'lg'],
        },
        {
            title: 'Email',
            dataIndex: ['contact', 'email'],
            sorter: true,
            search: true,
            valueType: 'text',
            responsive: ['xs', 'sm', 'md', 'lg'],
        },
        {
            title: 'Vai trò',
            dataIndex: ['role', 'name'],
            sorter: true,
            hideInSearch: true,
            responsive: ['xs', 'sm', 'md', 'lg'],
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
            responsive: ['lg'],
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
            responsive: ['lg'],
        },
        {
            title: 'Hành động',
            hideInSearch: true,
            width: 100,
            responsive: ['xs', 'sm', 'md', 'lg'],
            render: (_value, entity, _index, _action) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.APPLICANTS.UPDATE} hideChildren>
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
                    <Access permission={ALL_PERMISSIONS.APPLICANTS.DELETE} hideChildren>
                        <Popconfirm
                            placement="bottom"
                            title={'Xác nhận xóa ứng viên'}
                            description={'Bạn có chắc chắn muốn xóa ứng viên này ?'}
                            onConfirm={() => handleDeleteApplicant(entity.userId)}
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

    const handleDeleteApplicant = async (userId: string | undefined) => {
        if (userId) {
            const res = await callDeleteApplicant(userId);
            if (res && +res.statusCode === 200) {
                message.success('Xóa ứng viên thành công');
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
        if (clone.contact?.email) {
            q.filter = clone.fullName
                ? q.filter + ' and ' + `${sfLike('contact.email', clone.contact?.email)}`
                : `${sfLike('contact.email', clone.contact?.email)}`;
        }

        if (!q.filter) delete q.filter;

        let temp = queryString.stringify(q);

        let sortBy = '';
        if (sort && sort.fullName) {
            sortBy = sort.fullName === 'ascend' ? 'sort=fullName,asc' : 'sort=fullName,desc';
        }
        if (sort && sort['contact,email']) {
            sortBy = sort['contact,email'] === 'ascend' ? 'sort=contact.email,asc' : 'sort=contact.email,desc';
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
            <Access permission={ALL_PERMISSIONS.APPLICANTS.GET_PAGINATE}>
                <DataTable<IApplicant>
                    columns={columns}
                    actionRef={tableRef}
                    headerTitle="Danh sách ứng viên"
                    rowKey="userId"
                    loading={isFetching}
                    dataSource={applicants}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        await dispatch(fetchApplicant({ query }));
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
                                    {range[0]}-{range[1]} trên {total} hàng
                                </div>
                            );
                        },
                    }}
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Access permission={ALL_PERMISSIONS.APPLICANTS.CREATE} hideChildren>
                                <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModal(true)}>
                                    Thêm mới
                                </Button>
                            </Access>
                        );
                    }}
                    search={{ labelWidth: 'auto' }}
                />
            </Access>
            <ModalApplicant
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    );
};

export default ApplicantPage;
