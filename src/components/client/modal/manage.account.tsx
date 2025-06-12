import { Modal, Tabs } from 'antd';
import type { TabsProps } from 'antd/lib';
import { isMobile } from 'react-device-detect';
import ApplicantApplication from './tab/applicant.application';
import JobByEmail from './tab/job.email';

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;

    const items: TabsProps['items'] = [
        {
            key: 'applicant-application',
            label: `Rải CV`,
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
                <div style={{ minHeight: 400 }}>
                    <Tabs defaultActiveKey="applicant-application" items={items} />
                </div>
            </Modal>
        </>
    );
};

export default ManageAccount;
