import { Tabs, type TabsProps } from 'antd';
import Access from '../../../components/share/access';
import { ALL_PERMISSIONS } from '../../../config/permissions';
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
            <Access permission={ALL_PERMISSIONS.RECRUITERS.GET_PAGINATE}>
                <Tabs defaultActiveKey="1" items={items} />
            </Access>
        </div>
    );
};

export default UserTab;
