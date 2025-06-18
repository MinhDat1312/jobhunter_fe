import { Tabs, type TabsProps } from 'antd';
import RecruiterPage from './recruiter';
import ApplicantPage from './applicant';

const UserTab = () => {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Nhà tuyển dụng',
            children: <RecruiterPage />,
        },
        {
            key: '2',
            label: 'Ứng viên',
            children: <ApplicantPage />,
        },
    ];

    return (
        <div>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    );
};

export default UserTab;
