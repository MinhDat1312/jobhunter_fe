import { useEffect, useState } from 'react';
import type { IApplication } from '../../../types/backend';
import { eventBus } from '../../../config/eventBus';
import { callFetchApplicationByApplicant } from '../../../config/api';
import type { ColumnsType } from 'antd/es/table';
import { colorStatus } from '../../../config/utils';
import dayjs from 'dayjs';
import Access from '../../share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
import { Card, Grid, Table } from 'antd';

const { useBreakpoint } = Grid;

const ApplicationApplicant = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;

    const [listApplication, setListApplication] = useState<IApplication[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchApplicationByApplicant();
            if (res && res.data) {
                setListApplication(res.data.result as IApplication[]);
            }
            setIsFetching(false);
        };

        init();

        eventBus.on('jobApplied', init);

        return () => eventBus.off('jobApplied', init);
    }, []);

    const columns: ColumnsType<IApplication> = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: 'center',
            render: (_text, _record, index) => {
                return <>{index + 1}</>;
            },
            responsive: ['md', 'lg'],
        },
        {
            title: 'Nhà tuyển dụng',
            dataIndex: 'recruiterName',
            responsive: ['xs', 'sm'],
        },
        {
            title: 'Tiêu đề',
            dataIndex: ['job', 'title'],
            responsive: ['xs', 'sm', 'md', 'lg'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (_text, record) => {
                const { color, label } = colorStatus(record.status);
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
            responsive: ['xs', 'md', 'lg'],
        },
        {
            title: 'Ngày nộp',
            dataIndex: 'createdAt',
            render(_value, record, _index) {
                return <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>;
            },
            responsive: ['lg'],
        },
        {
            title: 'Xem CV',
            dataIndex: '',
            render(record) {
                return (
                    <a href={`${record?.resumeUrl}`} target="_blank">
                        Chi tiết
                    </a>
                );
            },
            responsive: ['xs', 'sm', 'md', 'lg'],
        },
    ];

    return (
        <Access permission={ALL_PERMISSIONS.APPLICATIONS.GET_PAGINATE_APPLICANT}>
            <Card
                style={{
                    marginBlock: '32px',
                    marginRight: isMobile || isTablet ? '0px' : '100px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Table<IApplication>
                    columns={columns}
                    rowKey="applicationId"
                    dataSource={listApplication}
                    loading={isFetching}
                    pagination={false}
                    scroll={{ x: true }}
                    style={{
                        height: 300,
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                />
            </Card>
        </Access>
    );
};

export default ApplicationApplicant;
