import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IApplication } from '../../types/backend';
import { callFetchApplication, callFetchApplicationByRecruiter } from '../../config/api';

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: IApplication[];
}

const initialState: IState = {
    isFetching: true,
    meta: {
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
    },
    result: [],
};

export const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchApplicationByRecruiter.pending, (state, _action) => {
            state.isFetching = true;
        });

        builder.addCase(fetchApplicationByRecruiter.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        });

        builder.addCase(fetchApplicationByRecruiter.rejected, (state, _action) => {
            state.isFetching = false;
        });

        builder.addCase(fetchApplication.pending, (state, _action) => {
            state.isFetching = true;
        });

        builder.addCase(fetchApplication.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        });

        builder.addCase(fetchApplication.rejected, (state, _action) => {
            state.isFetching = false;
        });
    },
});

export const fetchApplication = createAsyncThunk(
    'application/fetchApplication',
    async ({ query }: { query: string }) => {
        const response = await callFetchApplication(query);
        return response;
    },
);

export const fetchApplicationByRecruiter = createAsyncThunk(
    'application/fetchApplicationByRecruiter',
    async ({ query }: { query: string }) => {
        const response = await callFetchApplicationByRecruiter(query);
        return response;
    },
);

export default applicationSlice.reducer;
