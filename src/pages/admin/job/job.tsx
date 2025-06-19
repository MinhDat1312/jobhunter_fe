import { useRef } from 'react';
import DataTable from '../../../components/data.table';
import Access from '../../../components/share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import type { IJob } from '../../../types/backend';
import { ProFormSelect, type ActionType, type ProColumns } from '@ant-design/pro-components';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { Button, message, notification, Popconfirm, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { callDeleteJob } from '../../../config/api';
import { fetchJob } from '../../../redux/slice/jobSlice';
import { sfIn } from 'spring-filter-query-builder';
import queryString from 'query-string';

const JobPage = () => {
    const dispatch = useAppDispatch();
    const isFetching = useAppSelector((state) => state.job.isFetching);
    const meta = useAppSelector((state) => state.job.meta);
    const jobs = useAppSelector((state) => state.job.result);

    const tableRef = useRef<ActionType>(null);
    const navigate = useNavigate();

    const columns: ProColumns<IJob>[] = [
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
            title: 'Tiêu đề',
            dataIndex: 'title',
            sorter: true,
        },
        {
            title: 'Công ty',
            dataIndex: ['recruiter', 'fullName'],
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Mức lương',
            dataIndex: 'salary',
            sorter: true,
            render(_dom, entity, _index, _action, _schema) {
                const str = '' + entity.salary;
                return <>{str?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</>;
            },
        },
        {
            title: 'Level',
            dataIndex: 'level',
            renderFormItem: (_item, _props, _form) => (
                <ProFormSelect
                    showSearch
                    mode="multiple"
                    allowClear
                    valueEnum={{
                        FRESHER: 'Fresher',
                        JUNIOR: 'Junior',
                        SENIOR: 'Senior',
                        INTERN: 'Intern',
                        MIDDLE: 'Middle',
                    }}
                    placeholder="Chọn level"
                    fieldProps={{
                        suffixIcon: null,
                        maxTagCount: 2,
                        maxTagPlaceholder: (omittedValues) => `+${omittedValues.length}`,
                    }}
                />
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            render(_dom, entity, _index, _action, _schema) {
                return (
                    <>
                        <Tag color={entity.active ? 'lime' : 'red'}>{entity.active ? 'ACTIVE' : 'INACTIVE'}</Tag>
                    </>
                );
            },
            hideInSearch: true,
        },

        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (_text, record, _index, _action) => {
                return <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ''}</>;
            },
            hideInSearch: true,
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (_text, record, _index, _action) => {
                return <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ''}</>;
            },
            hideInSearch: true,
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.JOBS.UPDATE} hideChildren>
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                navigate(`/admin/job/upsert?id=${entity.jobId}`);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.JOBS.DELETE} hideChildren>
                        <Popconfirm
                            placement="leftTop"
                            title={'Xác nhận xóa tin'}
                            description={'Bạn có chắc chắn muốn xóa tin này ?'}
                            onConfirm={() => handleDeleteJob(entity.jobId)}
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

    const buildQuery = (params: any, sort: any, _filter: any) => {
        const clone = { ...params };
        let parts = [];
        if (clone.title) parts.push(`title ~ '${clone.title}'`);
        if (clone.salary) parts.push(`salary ~ '${clone.salary}'`);
        if (clone?.level?.length) {
            parts.push(`${sfIn('level', clone.level).toString()}`);
        }

        clone.filter = parts.join(' and ');
        if (!clone.filter) delete clone.filter;

        clone.page = clone.current;
        clone.size = clone.pageSize;

        delete clone.current;
        delete clone.pageSize;
        delete clone.title;
        delete clone.salary;
        delete clone.level;

        let temp = queryString.stringify(clone);

        let sortBy = '';
        const fields = ['title', 'salary', 'createdAt', 'updatedAt'];
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

    const handleDeleteJob = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteJob(id);
            if (res && res.data) {
                message.success('Xóa tin thành công');
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
            <Access permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}>
                <DataTable<IJob>
                    actionRef={tableRef}
                    headerTitle="Danh sách tin tuyển dụng"
                    rowKey="jobId"
                    loading={isFetching}
                    columns={columns}
                    dataSource={jobs}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        await dispatch(fetchJob({ query }));
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
                                    {range[0]}-{range[1]} trên {total} rows
                                </div>
                            );
                        },
                    }}
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Button icon={<PlusOutlined />} type="primary" onClick={() => navigate('upsert')}>
                                Thêm mới
                            </Button>
                        );
                    }}
                />
            </Access>
        </div>
    );
};

export default JobPage;
