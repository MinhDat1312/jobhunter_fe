import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header.client';
import Footer from './footer.client';
import styles from '../../styles/app.module.scss';

const LayoutClient = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (rootRef && rootRef.current) {
            rootRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]);

    return (
        <div className="layout-app" ref={rootRef}>
            <Header />
            <div className={styles['content-app']}>
                <Outlet context={[searchTerm, setSearchTerm]} />
            </div>
            <Footer />
        </div>
    );
};

export default LayoutClient;
