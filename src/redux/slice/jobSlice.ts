import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IJob } from '../../types/backend';
import { callFetchJob } from '../../config/api';

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: IJob[];
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

export const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchJob.pending, (state, _action) => {
            state.isFetching = true;
        });

        builder.addCase(fetchJob.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        });

        builder.addCase(fetchJob.rejected, (state, _action) => {
            state.isFetching = false;
        });
    },
});

export const fetchJob = createAsyncThunk('job/fetchJob', async ({ query }: { query: string }) => {
    const response = await callFetchJob(query);
    return response;
});

export default jobSlice.reducer;
