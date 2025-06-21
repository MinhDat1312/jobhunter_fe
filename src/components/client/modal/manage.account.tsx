import { Modal, Tabs } from 'antd';
import type { TabsProps } from 'antd/lib';
import { isMobile } from 'react-device-detect';
import ApplicantApplication from './tab/applicant.application';
import JobByEmail from './tab/job.email';
import { useAppSelector } from '../../../redux/hook';
import NotPermitted from '../../share/protected-route/not-permitted';

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;
    const activeRole = useAppSelector((state) => state.account?.user?.role?.active);

    const items: TabsProps['items'] = [
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
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: `//todo`,
        },
        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children: `//todo`,
        },
    ];

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
                    <div
                        style={{
                            height: 400,
                            overflowY: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
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
