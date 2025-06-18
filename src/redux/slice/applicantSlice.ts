import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IApplicant } from '../../types/backend';
import { callFetchApplicant } from '../../config/api';

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: IApplicant[];
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

export const applicantSlice = createSlice({
    name: 'applicant',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchApplicant.pending, (state, _action) => {
            state.isFetching = true;
        });

        builder.addCase(fetchApplicant.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        });

        builder.addCase(fetchApplicant.rejected, (state, _action) => {
            state.isFetching = false;
        });
    },
});

export const fetchApplicant = createAsyncThunk('applicant/fetchApplicant', async ({ query }: { query: string }) => {
    const response = await callFetchApplicant(query);
    return response;
});

export default applicantSlice.reducer;
