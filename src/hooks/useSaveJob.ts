import { message, notification } from 'antd';
import { useAppDispatch, useAppSelector } from './hook';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { callSaveJobs } from '../config/api';
import { setSavedJobs } from '../redux/slice/accountSlice';

const useSaveJob = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.account.user);
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const [saveJob, setSaveJob] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        const savedJobsArray = user.savedJobs || [];
        const savedJobsObj: { [key: number]: boolean } = {};
        savedJobsArray.forEach((job: { jobId: number }) => {
            if (job && typeof job.jobId === 'number') {
                savedJobsObj[job.jobId] = true;
            }
        });
        setSaveJob(savedJobsObj);
    }, [user.savedJobs]);

    const toggleSave = async (id: number) => {
        if (!isAuthenticated) {
            message.error(t('notify.signin_saved_job'));
            return;
        }

        const newSaveJob = {
            ...saveJob,
            [id]: !saveJob[id],
        };

        setSaveJob(newSaveJob);
        await savedJobs(newSaveJob);
    };

    const savedJobs = async (jobs: { [jobId: number]: boolean }) => {
        const savedJobIds = Object.entries(jobs)
            .filter(([_, isActive]) => isActive)
            .map(([id]) => {
                return { jobId: +id };
            });

        const saveJobs = await callSaveJobs(+user.userId, savedJobIds);
        if (saveJobs?.data) {
            message.success(t('notify.saved_job'));
            dispatch(setSavedJobs(savedJobIds));
        } else {
            notification.error({
                message: t('notify.error'),
                description: saveJobs.message,
            });
        }
    };

    return {
        user,
        saveJob,
        setSaveJob,
        toggleSave,
        savedJobs,
    };
};

export default useSaveJob;
