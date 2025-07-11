import { useEffect, useState } from 'react';
import { callCountJobByRecruiter } from '../config/api';

const useTotalJobRecruiter = () => {
    const [totalJob, setTotalJob] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        const init = async () => {
            const res = await callCountJobByRecruiter();
            if (res?.data) {
                setTotalJob(res.data);
            }
        };

        init();
    }, []);

    return { totalJob, setTotalJob };
};

export default useTotalJobRecruiter;
