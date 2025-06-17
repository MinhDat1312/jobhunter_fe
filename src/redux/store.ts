import { configureStore, type Action, type ThunkAction } from '@reduxjs/toolkit';
import accountReducer from './slice/accountSlice';
import recruiterReducer from './slice/recruiterSlice';
import applicantReducer from './slice/applicantSlice';

export const store = configureStore({
    reducer: {
        account: accountReducer,
        recruiter: recruiterReducer,
        applicant: applicantReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
