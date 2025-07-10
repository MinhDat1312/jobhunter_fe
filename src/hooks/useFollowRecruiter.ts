import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from './hook';
import { useEffect, useState } from 'react';
import { message, notification } from 'antd';
import { callFollowRecruiters } from '../config/api';
import { setFollowedRecruiters } from '../redux/slice/accountSlice';

const useFollowRecruiter = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.account.user);
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const [followRecruiter, setFollowRecruiter] = useState<{ [key: number]: boolean }>({});
    let notify = '';

    useEffect(() => {
        const followedRecruitersArray = user.followedRecruiters || [];
        const followedRecruitersObj: { [key: number]: boolean } = {};
        followedRecruitersArray.forEach((recruiter: { userId: number }) => {
            if (recruiter && typeof recruiter.userId === 'number') {
                followedRecruitersObj[recruiter.userId] = true;
            }
        });
        setFollowRecruiter(followedRecruitersObj);
    }, [user.followedRecruiters]);

    const toggleFollow = async (id: number) => {
        if (!isAuthenticated) {
            message.error(t('notify.signin_followed_recruiter'));
            return;
        }

        if (followRecruiter[id]) {
            notify = 'notify.unfollowed_recruiter';
        } else notify = 'notify.followed_recruiter';

        const newFollowRecruiter = {
            ...followRecruiter,
            [id]: !followRecruiter[id],
        };

        setFollowRecruiter(newFollowRecruiter);
        await followedRecruiters(newFollowRecruiter);
    };

    const followedRecruiters = async (recruiters: { [userId: number]: boolean }) => {
        const followedRecruiterIds = Object.entries(recruiters)
            .filter(([_, isActive]) => isActive)
            .map(([id]) => {
                return { userId: +id };
            });

        const followRecruiters = await callFollowRecruiters(+user.userId, followedRecruiterIds);
        if (followRecruiters?.data) {
            message.success(t(notify));
            dispatch(setFollowedRecruiters(followedRecruiterIds));
        } else {
            notification.error({
                message: t('notify.error'),
                description: followRecruiters.message,
            });
        }
    };

    return {
        user,
        followRecruiter,
        setFollowRecruiter,
        toggleFollow,
        followedRecruiters,
    };
};

export default useFollowRecruiter;
