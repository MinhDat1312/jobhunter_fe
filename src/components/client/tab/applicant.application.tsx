import { useEffect, useState } from 'react';
import type { IApplication } from '../../../types/backend';
import { callFetchApplicationByApplicant } from '../../../config/api';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Table } from 'antd';

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
    }, []);

    const columns: ColumnsType<IApplication> = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: 'center',
            render: (index) => {
                return <>{index + 1}</>;
            },
        },
        {
            title: 'Nhà tuyển dụng',
            dataIndex: ['recruiterId', 'fullName'],
        },
        {
            title: 'Tiêu đề',
            dataIndex: ['jobId', 'title'],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
        },
        {
            title: 'Ngày nộp',
            dataIndex: 'createdAt',
            render(record) {
                return <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>;
            },
        },
        {
            title: '',
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
        <div>
            <Table<IApplication>
                columns={columns}
                dataSource={listApplication}
                loading={isFetching}
                pagination={false}
            />
        </div>
    );
};

export default ApplicantApplication;
