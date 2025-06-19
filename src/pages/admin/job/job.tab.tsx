import { Tabs, type TabsProps } from 'antd';
import JobPage from './job';
import SkillPage from './skill';

const JobTab = () => {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Tin tuyển dụng',
            children: <JobPage />,
        },
        {
            key: '2',
            label: 'Kỹ năng',
            children: <SkillPage />,
        },
    ];

    return <Tabs defaultActiveKey="1" items={items} />;
};

export default JobTab;
