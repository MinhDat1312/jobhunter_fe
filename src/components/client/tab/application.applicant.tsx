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
import { useTranslation } from 'react-i18next';

const { useBreakpoint } = Grid;

const ApplicationApplicant = () => {
    const { t } = useTranslation();

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
            title: t('table.no_1'),
            key: 'index',
            width: 50,
            align: 'center',
            render: (_text, _record, index) => {
                return <>{index + 1}</>;
            },
            responsive: ['md', 'lg'],
        },
        {
            title: t('table.applied_table.recruiter'),
            dataIndex: 'recruiterName',
            responsive: ['xs', 'sm'],
        },
        {
            title: t('table.applied_table.title'),
            dataIndex: ['job', 'title'],
            responsive: ['xs', 'sm', 'md', 'lg'],
        },
        {
            title: t('table.applied_table.status'),
            dataIndex: 'status',
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
            responsive: ['xs', 'md', 'lg'],
        },
        {
            title: t('table.applied_table.applied_at'),
            dataIndex: 'createdAt',
            render(_value, record, _index) {
                return <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>;
            },
            responsive: ['lg'],
        },
        {
            title: t('table.applied_table.view_cv'),
            dataIndex: '',
            render(record) {
                return (
                    <a href={`${record?.resumeUrl}`} target="_blank" style={{ color: '#00b452' }}>
                        {t('detail')}
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
