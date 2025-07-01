import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './pages/auth/register';
import LayoutApp from './components/share/layout.app';
import LayoutClient from './components/client/layout.client';
import NotFound from './components/share/not.found';
import LoginPage from './pages/auth/login';
import { useEffect } from 'react';
import { useAppDispatch } from './hooks/hook';
import { fetchAccount } from './redux/slice/accountSlice';
import HomePage from './pages/home/home';
import ClientJobPage from './pages/job/job';
import ClientJobDetailPage from './pages/job/detail';
import ClientRecruiterPage from './pages/recruiter/recruiter';
import ClientRecruiterDetailPage from './pages/recruiter/detail';
import LayoutAdmin from './components/admin/layout.admin';
import ProtectedRoute from './components/share/protected-route/protected-route';
import DashboardPage from './pages/admin/dashboard';
import UserTab from './pages/admin/user/user.tab';
import JobTab from './pages/admin/job/job.tab';
import ViewUpsertJob from './components/admin/job/upsert.job';
import ApplicationPage from './pages/admin/application';
import RoleTab from './pages/admin/role/role.tab';
import LayoutProfile from './components/layout.profile';
import UpdateInfo from './components/client/modal/tab/update.info';
import UpdatePassword from './components/client/modal/tab/update.password';
import ApplicantApplication from './components/client/modal/tab/applicant.application';
import SubscriptionEmail from './components/client/modal/tab/subscription.email';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <LayoutApp>
                <LayoutClient />
            </LayoutApp>
        ),
        errorElement: <NotFound />,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: 'job',
                element: <ClientJobPage />,
            },
            {
                path: 'job/:id',
                element: <ClientJobDetailPage />,
            },
            {
                path: 'recruiter',
                element: <ClientRecruiterPage />,
            },
            {
                path: 'recruiter/:id',
                element: <ClientRecruiterDetailPage />,
            },
        ],
    },
    {
        path: '/admin',
        element: (
            <LayoutApp>
                <LayoutAdmin />
            </LayoutApp>
        ),
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'user',
                element: (
                    <ProtectedRoute>
                        <UserTab />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'job',
                children: [
                    {
                        index: true,
                        element: (
                            <ProtectedRoute>
                                <JobTab />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: 'upsert',
                        element: (
                            <ProtectedRoute>
                                <ViewUpsertJob />
                            </ProtectedRoute>
                        ),
                    },
                ],
            },
            {
                path: 'application',
                element: (
                    <ProtectedRoute>
                        <ApplicationPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'role',
                element: (
                    <ProtectedRoute>
                        <RoleTab />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '/profile',
        element: (
            <LayoutApp>
                <LayoutProfile />
            </LayoutApp>
        ),
        errorElement: <NotFound />,
        children: [
            { index: true, element: <UpdateInfo /> },
            { path: 'setting', element: <UpdatePassword /> },
            { path: 'my-jobs', element: <ApplicantApplication /> },
            { path: 'subscription', element: <SubscriptionEmail /> },
        ],
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
]);

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (window.location.pathname === '/login' || window.location.pathname === '/register') return;
        dispatch(fetchAccount());
    }, []);

    return <RouterProvider router={router} />;
}

export default App;
