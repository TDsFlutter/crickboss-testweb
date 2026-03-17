import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { isLoggedIn, loading } = useAuth();
    
    // Prevent flashing login or redirecting before auth check completes
    if (loading) return null;
    
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return <Outlet />;
}
