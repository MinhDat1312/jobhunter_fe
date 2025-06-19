import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { ISkill } from '../../types/backend';
import { callFetchAllSkill } from '../../config/api';

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: ISkill[];
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

export const skillSlice = createSlice({
    name: 'skill',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchSkill.pending, (state, _action) => {
            state.isFetching = true;
        });

        builder.addCase(fetchSkill.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        });

        builder.addCase(fetchSkill.rejected, (state, _action) => {
            state.isFetching = false;
        });
    },
});

export const fetchSkill = createAsyncThunk('skill/fetchSkill', async ({ query }: { query: string }) => {
    const response = await callFetchAllSkill(query);
    return response;
});

export default skillSlice.reducer;
