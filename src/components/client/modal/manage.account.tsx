import { Modal, Tabs } from 'antd';
import type { TabsProps } from 'antd/lib';
import { isMobile } from 'react-device-detect';
import ApplicantApplication from './tab/applicant.application';
import JobByEmail from './tab/job.email';
import { useAppSelector } from '../../../redux/hook';
import NotPermitted from '../../share/protected-route/not-permitted';
import UpdateInfo from './tab/update.info';
import { useEffect, useState } from 'react';
import { callFetchUserByEmail } from '../../../config/api';
import type { IFullUser } from '../../../types/backend';

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;
    const activeRole = useAppSelector((state) => state.account?.user?.role?.active);
    const userSlice = useAppSelector((state) => state.account.user);
    const [user, setUser] = useState<IFullUser | null>(null);

    const items: TabsProps['items'] = [
        {
            key: 'applicant-application',
            label: `Ứng tuyển`,
            children: <ApplicantApplication />,
        },
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UpdateInfo onClose={onClose} dataInit={user} />,
        },
        {
            key: 'email-by-skills',
            label: `Nhận Jobs qua Email`,
            children: <JobByEmail />,
        },
    ];

    useEffect(() => {
        const init = async () => {
            const res = await callFetchUserByEmail();
            if (res?.data.userId) {
                setUser(res.data);
            }
        };

        init();
    }, []);

    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                width={isMobile ? '100%' : '1000px'}
            >
                {activeRole ? (
                    <div style={{ minHeight: 400 }}>
                        <Tabs defaultActiveKey="applicant-application" items={items} />
                    </div>
                ) : (
                    <NotPermitted onClose={onClose} />
                )}
            </Modal>
        </>
    );
};

export default ManageAccount;
