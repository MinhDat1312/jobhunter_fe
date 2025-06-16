import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IRecruiter } from '../../types/backend';
import { callFetchRecruiter } from '../../config/api';

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: IRecruiter[];
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

export const recruiterSlide = createSlice({
    name: 'recruiter',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchRecruiter.pending, (state, _action) => {
            state.isFetching = true;
        });

        builder.addCase(fetchRecruiter.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        });

        builder.addCase(fetchRecruiter.rejected, (state, _action) => {
            state.isFetching = false;
        });
    },
});

export const fetchRecruiter = createAsyncThunk('recruiter/fetchRecruiter', async ({ query }: { query: string }) => {
    const response = await callFetchRecruiter(query);
    return response;
});

export default recruiterSlide.reducer;
