import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { callFetchAccount } from '../../config/api';

interface IState {
    isAuthenticated: boolean;
    isLoading: boolean;
    isRefreshToken: boolean;
    errorRefreshToken: string;
    user: {
        userId: string;
        email: string;
        fullName: string;
        role: {
            roleId?: string;
            name?: string;
            active?: boolean;
            permissions?: {
                permissionId: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[];
        };
    };
    activeMenu: string;
}

const initialState: IState = {
    isAuthenticated: false,
    isLoading: true,
    isRefreshToken: false,
    errorRefreshToken: '',
    user: {
        userId: '',
        email: '',
        fullName: '',
        role: {
            roleId: '',
            name: '',
            active: false,
            permissions: [],
        },
    },
    activeMenu: 'home',
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },

        setUserLoginInfo: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user.userId = action?.payload?.userId;
            state.user.email = action.payload.email;
            state.user.fullName = action.payload.fullName;
            state.user.role = action?.payload?.role;

            if (!action?.payload?.user?.role) state.user.role = {};
            state.user.role.permissions = action?.payload?.role?.permissions ?? [];
        },

        setLogoutAction: (state) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;
            state.user = {
                userId: '',
                email: '',
                fullName: '',
                role: {
                    roleId: '',
                    name: '',
                    active: false,
                    permissions: [],
                },
            };
        },

        setRefreshTokenAction: (state, action) => {
            state.isRefreshToken = action.payload?.status ?? false;
            state.errorRefreshToken = action.payload?.message ?? '';
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAccount.pending, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = false;
                state.isLoading = true;
            }
        });

        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = true;
                state.isLoading = false;
                state.user.userId = action?.payload?.user?.userId;
                state.user.email = action.payload.user?.email;
                state.user.fullName = action.payload.user?.fullName;
                state.user.role = action?.payload?.user?.role;

                if (!action?.payload?.user?.role) state.user.role = {};
                state.user.role.permissions = action?.payload?.user?.role?.permissions ?? [];
            }
        });

        builder.addCase(fetchAccount.rejected, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = false;
                state.isLoading = false;
            }
        });
    },
});

export const fetchAccount = createAsyncThunk('account/fetchAccount', async () => {
    const response = await callFetchAccount();
    return response.data;
});

export const { setActiveMenu, setUserLoginInfo, setLogoutAction, setRefreshTokenAction } = accountSlice.actions;

export default accountSlice.reducer;
