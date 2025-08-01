import { notification } from 'antd';
import { callLikeBlogs } from '../config/api';
import { setActorNotifications } from '../redux/slice/accountSlice';
import type { IBlog } from '../types/backend';
import { useAppDispatch } from './hook';
import { useTranslation } from 'react-i18next';
import type { Dispatch, SetStateAction } from 'react';

interface IProps {
    setDisplayBlog?: Dispatch<SetStateAction<IBlog[] | null>>;
}

const useLikeBlog = (props: IProps) => {
    const { setDisplayBlog } = props;

    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const handleOnLike = async (blog: IBlog, like: boolean) => {
        const res = await callLikeBlogs(blog, !like);
        if (res?.data) {
            dispatch(setActorNotifications(res.data));
        } else {
            notification.error({
                message: t('notify.error'),
                description: res.message,
            });
        }

        if (setDisplayBlog) {
            setDisplayBlog((prev) =>
                prev
                    ? prev.map((item) =>
                          item.blogId === blog.blogId
                              ? {
                                    ...item,
                                    activity: item.activity
                                        ? {
                                              ...item.activity,
                                              totalLikes: Math.max(0, item.activity.totalLikes + (like ? -1 : 1)),
                                              totalComments:
                                                  typeof item.activity.totalComments === 'number'
                                                      ? item.activity.totalComments
                                                      : 0,
                                              totalReads:
                                                  typeof item.activity.totalReads === 'number'
                                                      ? item.activity.totalReads
                                                      : 0,
                                              totalParentComments:
                                                  typeof item.activity.totalParentComments === 'number'
                                                      ? item.activity.totalParentComments
                                                      : 0,
                                          }
                                        : {
                                              totalLikes: like ? 0 : 1,
                                              totalComments: 0,
                                              totalReads: 0,
                                              totalParentComments: 0,
                                          },
                                }
                              : item,
                      )
                    : prev,
            );
        }
    };

    return { handleOnLike };
};

export default useLikeBlog;
