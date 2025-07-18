import { Divider } from 'antd';
import SearchClient from '../../components/client/search.client';
import styles from '../../styles/client.module.scss';
import RecruiterCard from '../../components/client/card/recruiter.card';
import JobCard from '../../components/client/card/job.card';

const HomePage = () => {
    return (
        <div className={`${styles['container']} ${styles['home-section']}`}>
            <div className="search-content" style={{ marginTop: 20 }}>
                <SearchClient />
            </div>
            <Divider style={{ margin: '24px 0 0' }} />
            <RecruiterCard />
            <Divider style={{ margin: '50px 0 0' }} />
            <JobCard />
        </div>
    );
};

export default HomePage;
