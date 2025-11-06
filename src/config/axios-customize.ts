import type { IBackendRes } from '../types/backend';
import { Mutex } from 'async-mutex';
import axiosClient from 'axios';
import { store } from '../redux/store';
import { setRefreshTokenAction } from '../redux/slice/accountSlice';
import { notification, message } from 'antd';

interface AccessTokenResponse {
    access_token: string;
}

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

const handleRefreshToken = async (): Promise<string | any> => {
    return await mutex.runExclusive(async () => {
        try {
            const res = await refreshInstance.get<IBackendRes<AccessTokenResponse>>('/api/v1/auth/refresh');
            const newAccessToken = res?.data?.access_token ?? null;

            if (!newAccessToken) {
                localStorage.removeItem('access_token');
                return null;
            }

            return newAccessToken;
        } catch (err) {
            localStorage.removeItem('access_token');
            return null;
        }
    });
};

instance.interceptors.request.use(function (config) {
    if (typeof window !== 'undefined' && window && window.localStorage && window.localStorage.getItem('access_token')) {
        if (config.url !== '/api/v1/auth/refresh') {
            config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
        }
    }
    if (!config.headers.Accept && config.headers['Content-Type']) {
        config.headers.Accept = 'application/json';
        config.headers['Content-Type'] = 'application/json; charset=utf-8';
    }
    return config;
});

instance.interceptors.response.use(
    (res) => res.data,
    async (error) => {
        if (
            error.config &&
            error.response &&
            +error.response.status === 401 &&
            error.config.url !== '/api/v1/auth/login' &&
            !error.config.headers[NO_RETRY_HEADER]
        ) {
            const access_token = await handleRefreshToken();
            error.config.headers[NO_RETRY_HEADER] = 'true';
            if (access_token) {
                error.config.headers['Authorization'] = `Bearer ${access_token}`;
                localStorage.setItem('access_token', access_token);
                return instance.request(error.config);
            }
        }

        if (
            error.config &&
            error.response &&
            +error.response.status === 400 &&
            error.config.url === '/api/v1/auth/refresh' &&
            location.pathname.startsWith('/admin')
        ) {
            const message = error?.response?.data?.error ?? 'Có lỗi xảy ra, vui lòng login.';
            store.dispatch(setRefreshTokenAction({ status: true, message }));
        }

        if (+error.response.status === 403) {
            notification.error({
                message: error?.response?.data?.message ?? '',
                description: error?.response?.data?.error ?? '',
            });
        }

        return error?.response?.data ?? Promise.reject(error);
    },
);

/**
 * Replaces main `axios` instance with the custom-one.
 *
 * @param cfg - Axios configuration object.
 * @returns A promise object of a response of the HTTP request with the 'data' object already
 * destructured.
 */
// const axios = <T>(cfg: AxiosRequestConfig) => instance.request<any, T>(cfg);

// export default axios;

export default instance;
