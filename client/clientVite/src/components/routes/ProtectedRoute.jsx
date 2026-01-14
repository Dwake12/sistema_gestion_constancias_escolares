import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const { token, loadingAuth } = useAuth()

    if (loadingAuth) return null; // o un loader
    if (!token) return <Navigate to="/login" replace />;

    return children;
}

export default ProtectedRoute



