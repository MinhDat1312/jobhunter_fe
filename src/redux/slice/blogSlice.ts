import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IBlog } from '../../types/backend';
import { callFetchBlog } from '../../config/api';

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: IBlog[];
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

export const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchBlog.pending, (state, _action) => {
            state.isFetching = true;
        });

        builder.addCase(fetchBlog.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        });

        builder.addCase(fetchBlog.rejected, (state, _action) => {
            state.isFetching = false;
        });
    },
});

export const fetchBlog = createAsyncThunk('blog/fetchBlog', async ({ query }: { query: string }) => {
    const response = await callFetchBlog(query);
    return response;
});

export default blogSlice.reducer;
