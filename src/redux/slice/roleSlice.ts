import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IRole } from '../../types/backend';
import { callFetchRole, callFetchRoleById } from '../../config/api';

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: IRole[];
    isFetchSingle: boolean;
    singleRole: IRole;
}

const initialState: IState = {
    isFetching: true,
    isFetchSingle: true,
    meta: {
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
    },
    result: [],
    singleRole: {
        roleId: '',
        name: '',
        description: '',
        active: false,
        permissions: [],
    },
};

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        resetSingleRole: (state, _action) => {
            state.singleRole = {
                roleId: '',
                name: '',
                description: '',
                active: false,
                permissions: [],
            };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRole.pending, (state, _action) => {
            state.isFetching = true;
        });

        builder.addCase(fetchRole.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
        });

        builder.addCase(fetchRole.rejected, (state, _action) => {
            state.isFetching = false;
        });

        builder.addCase(fetchRoleById.pending, (state, _action) => {
            state.isFetchSingle = true;
            state.singleRole = {
                roleId: '',
                name: '',
                description: '',
                active: false,
                permissions: [],
            };
        });

        builder.addCase(fetchRoleById.rejected, (state, _action) => {
            state.isFetchSingle = false;
            state.singleRole = {
                roleId: '',
                name: '',
                description: '',
                active: false,
                permissions: [],
            };
        });

        builder.addCase(fetchRoleById.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetchSingle = false;
                state.singleRole = {
                    roleId: action.payload.data.roleId,
                    name: action.payload.data.name,
                    description: action.payload.data.description,
                    active: action.payload.data.active,
                    permissions: action.payload.data.permissions,
                };
            }
        });
    },
});

export const fetchRole = createAsyncThunk('role/fetchRole', async ({ query }: { query: string }) => {
    const response = await callFetchRole(query);
    return response;
});

export const fetchRoleById = createAsyncThunk('role/fetchRoleById', async (id: string) => {
    const response = await callFetchRoleById(id);
    return response;
});

export const { resetSingleRole } = roleSlice.actions;
export default roleSlice.reducer;
