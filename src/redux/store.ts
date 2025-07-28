import { configureStore, type Action, type ThunkAction } from '@reduxjs/toolkit';
import accountReducer from './slice/accountSlice';
import recruiterReducer from './slice/recruiterSlice';
import applicantReducer from './slice/applicantSlice';
import jobReducer from './slice/jobSlice';
import skillReducer from './slice/skillSlice';
import careerReducer from './slice/careerSlice';
import applicationReducer from './slice/applicationSlice';
import permissionReducer from './slice/permissionSlice';
import roleReducer from './slice/roleSlice';
import blogReducer from './slice/blogSlice';

export const store = configureStore({
    reducer: {
        account: accountReducer,
        recruiter: recruiterReducer,
        applicant: applicantReducer,
        job: jobReducer,
        skill: skillReducer,
        career: careerReducer,
        application: applicationReducer,
        permission: permissionReducer,
        role: roleReducer,
        blog: blogReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
