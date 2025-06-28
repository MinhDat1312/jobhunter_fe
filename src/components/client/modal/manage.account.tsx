import { Modal, Tabs } from 'antd';
import type { TabsProps } from 'antd/lib';
import { isMobile } from 'react-device-detect';
import ApplicantApplication from './tab/applicant.application';
import JobByEmail from './tab/job.email';
import { useAppSelector } from '../../../hooks/hook';
import NotPermitted from '../../share/protected-route/not-permitted';
import UpdateInfo from './tab/update.info';
import { useEffect, useState } from 'react';
import { callFetchUserByEmail } from '../../../config/api';
import type { IFullUser } from '../../../types/backend';
import { ROLE_LIST } from '../../../config/utils';
import UpdatePassword from './tab/update.password';

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;
    const activeRole = useAppSelector((state) => state.account?.user?.role?.active);
    const [user, setUser] = useState<IFullUser | null>(null);

    const items: TabsProps['items'] = [
        ...(user?.role?.name !== ROLE_LIST[2].value
            ? []
            : [
                  {
                      key: 'applicant-application',
                      label: `Ứng tuyển`,
                      children: <ApplicantApplication />,
                  },
                  {
                      key: 'email-by-skills',
                      label: `Nhận Jobs qua Email`,
                      children: <JobByEmail />,
                  },
              ]),
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UpdateInfo onClose={onClose} dataInit={user} />,
        },
        {
            key: 'user-update-password',
            label: `Cập nhật mật khẩu`,
            children: <UpdatePassword onClose={onClose} dataInit={user} />,
        },
    ];

    useEffect(() => {
        const init = async () => {
            const res = await callFetchUserByEmail();
            if (res?.data && res?.data.userId) {
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
