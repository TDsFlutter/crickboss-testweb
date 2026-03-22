import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { isLoggedIn, loading } = useAuth();

    // While the silent auth check runs, show nothing so we don't flash /login
    // This only happens briefly on page refresh when tokens exist
    if (loading) return null;

    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return <Outlet />;
}
