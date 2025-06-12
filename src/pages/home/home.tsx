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
            <Divider />
            <RecruiterCard />
            <div style={{ margin: 50 }}></div>
            <Divider />
            <JobCard />
        </div>
    );
};

export default HomePage;
