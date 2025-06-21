import { useEffect, useState } from 'react';
import type { IApplication } from '../../../../types/backend';
import { callFetchApplicationByApplicant } from '../../../../config/api';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Table } from 'antd';
import { eventBus } from '../../../../config/eventBus';
import Access from '../../../share/access';
import { ALL_PERMISSIONS } from '../../../../config/permissions';

const ApplicantApplication = () => {
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
        },
        {
            title: 'Nhà tuyển dụng',
            dataIndex: 'recruiterName',
        },
        {
            title: 'Tiêu đề',
            dataIndex: ['job', 'title'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
        },
        {
            title: 'Ngày nộp',
            dataIndex: 'createdAt',
            render(_value, record, _index) {
                return <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>;
            },
        },
        {
            title: 'Xem CV',
            dataIndex: '',
            render(record) {
                return (
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/storage/resumes/${record?.resumeUrl}`}
                        target="_blank"
                    >
                        Chi tiết
                    </a>
                );
            },
        },
    ];

    return (
        <Access permission={ALL_PERMISSIONS.APPLICATIONS.GET_PAGINATE_APPLICANT}>
            <Table<IApplication>
                columns={columns}
                rowKey={'applicationId'}
                dataSource={listApplication}
                loading={isFetching}
                pagination={false}
            />
        </Access>
    );
};

export default ApplicantApplication;
