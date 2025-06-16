import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './pages/auth/register';
import LayoutApp from './components/share/layout.app';
import LayoutClient from './components/client/layout.client';
import NotFound from './components/share/not.found';
import LoginPage from './pages/auth/login';
import { useEffect } from 'react';
import { useAppDispatch } from './redux/hook';
import { fetchAccount } from './redux/slice/accountSlice';
import HomePage from './pages/home/home';
import ClientJobPage from './pages/job/job';
import ClientJobDetailPage from './pages/job/detail';
import ClientRecruiterPage from './pages/recruiter/recruiter';
import ClientRecruiterDetailPage from './pages/recruiter/detail';
import LayoutAdmin from './components/admin/layout.admin';
import ProtectedRoute from './components/share/protected-route/protected-route';
import DashboardPage from './pages/admin/dashboard';
import RecruiterPage from './pages/admin/recruiter';

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
                path: 'recruiter',
                element: (
                    <ProtectedRoute>
                        <RecruiterPage />
                    </ProtectedRoute>
                ),
            },
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
