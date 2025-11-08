import type { IBackendRes } from '../types/backend';
import { Mutex } from 'async-mutex';
import axiosClient from 'axios';
import { store } from '../redux/store';
import { setRefreshTokenAction } from '../redux/slice/accountSlice';
import { notification, message } from 'antd';

const instance = axiosClient.create({
    baseURL: import.meta.env.VITE_BACKEND_URL as string,
    withCredentials: true,
});

const refreshInstance = axiosClient.create({
    baseURL: import.meta.env.VITE_BACKEND_URL as string,
    withCredentials: true,
});

const mutex = new Mutex();
const NO_RETRY_HEADER = 'x-no-retry';

// Hàm refresh token
export const handleRefreshToken = async (): Promise<boolean> => {
    return await mutex.runExclusive(async () => {
        try {
            const res = await refreshInstance.get<IBackendRes<any>>('/api/v1/auth/refresh');
            return res.statusCode === 200;
        } catch (err) {
            // store.dispatch(
            //     setRefreshTokenAction({
            //         status: true,
            //         message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
            //     }),
            // );
            return false;
        }
    });
};

instance.interceptors.request.use((config) => {
    if (!config.headers.Accept) config.headers.Accept = 'application/json';
    if (!config.headers['Content-Type']) config.headers['Content-Type'] = 'application/json; charset=utf-8';
    return config;
});

instance.interceptors.response.use(
    (res) => res.data,
    async (error) => {
        const originalRequest = error.config;
        const response = error.response;

        if (!response) {
            notification.error({
                message: 'Lỗi kết nối',
                description: 'Không thể kết nối đến máy chủ',
            });
            return Promise.reject(error);
        }

        if (
            originalRequest &&
            response.status === 401 &&
            !originalRequest.headers[NO_RETRY_HEADER] &&
            !originalRequest.url.includes('/api/v1/auth/login') &&
            !originalRequest.url.includes('/api/v1/auth/refresh')
        ) {
            try {
                await mutex.waitForUnlock();

                const refreshed = await handleRefreshToken();
                originalRequest.headers[NO_RETRY_HEADER] = 'true';

                if (refreshed) return instance.request(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }

        // if (response.status === 400 && !originalRequest?.url.includes('/api/v1/auth/refresh')) {
        //     const message = response.data?.message ?? 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.';
        //     store.dispatch(setRefreshTokenAction({ status: true, message }));
        // }

        if (response.status === 403) {
            notification.error({
                message: response.data?.message ?? 'Không có quyền truy cập',
                description: response.data?.error ?? '',
            });
        }

        return Promise.reject(error);
    },
);

export default instance;
