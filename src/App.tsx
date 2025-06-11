import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './pages/auth/register';
import LayoutApp from './components/share/layout.app';
import LayoutClient from './components/client/layout.client';
import NotFound from './components/share/not.found';
import LoginPage from './pages/auth/login';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <LayoutApp>
                <LayoutClient />
            </LayoutApp>
        ),
        errorElement: <NotFound></NotFound>,
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
    return <RouterProvider router={router} />;
}

export default App;
