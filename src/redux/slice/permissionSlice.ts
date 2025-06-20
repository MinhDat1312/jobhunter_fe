import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IPermission } from "../../types/backend";
import { callFetchPermission } from "../../config/api";

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: IPermission[];
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

export const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPermission.pending, (state, _action) => {
            state.isFetching = true;
        });

        builder.addCase(fetchPermission.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        });

        builder.addCase(fetchPermission.rejected, (state, _action) => {
            state.isFetching = false;
        });
    },
});

export const fetchPermission = createAsyncThunk('permission/fetchPermission', async ({ query }: { query: string }) => {
    const response = await callFetchPermission(query);
    return response;
});

export default permissionSlice.reducer;
