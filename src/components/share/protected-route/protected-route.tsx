import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/hook';
import Loading from '../loading';
import NotPermitted from './not-permitted';

const RoleBaseRoute = (props: any) => {
    const user = useAppSelector((state) => state.account.user);
    const userRole = user.role.name;
    const activeRole = user.role.active;

    if (userRole !== 'APPLICANT' && activeRole) {
        return <>{props.children}</>;
    } else {
        return <NotPermitted />;
    }
};

const ProtectedRoute = (props: any) => {
    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const isLoading = useAppSelector((state) => state.account.isLoading);

    return (
        <>
            {isLoading === true ? (
                <Loading />
            ) : (
                <>
                    {isAuthenticated === true ? (
                        <>
                            <RoleBaseRoute>{props.children}</RoleBaseRoute>
                        </>
                    ) : (
                        <Navigate to="/login" replace />
                    )}
                </>
            )}
        </>
    );
};

export default ProtectedRoute;
