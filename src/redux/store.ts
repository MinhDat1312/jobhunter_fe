import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './slice/accountSlice';

export const store = configureStore({
    reducer: {
        account: accountReducer,
    },
});
