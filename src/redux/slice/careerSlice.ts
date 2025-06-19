import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { ICareer } from '../../types/backend';
import { callFetchAllCareer } from '../../config/api';

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: ICareer[];
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

export const careerSlice = createSlice({
    name: 'career',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCareer.pending, (state, _action) => {
            state.isFetching = true;
        });

        builder.addCase(fetchCareer.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        });

        builder.addCase(fetchCareer.rejected, (state, _action) => {
            state.isFetching = false;
        });
    },
});

export const fetchCareer = createAsyncThunk('career/fetchCareer', async ({ query }: { query: string }) => {
    const response = await callFetchAllCareer(query);
    return response;
});

export default careerSlice.reducer;
