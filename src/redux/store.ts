import { configureStore, type Action, type ThunkAction } from '@reduxjs/toolkit';
import accountReducer from './slice/accountSlice';
import recruiterReducer from './slice/recruiterSlice';

export const store = configureStore({
    reducer: {
        account: accountReducer,
        recruiter: recruiterReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
