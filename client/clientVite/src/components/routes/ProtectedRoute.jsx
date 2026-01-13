import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

/**
 * Componente que protege rutas que requieren autenticación
 * 
 * Si el usuario NO está autenticado (user es null), 
 * lo redirige automáticamente a /login
 * 
 * Si el usuario SÍ está autenticado, muestra el componente children
 */

function ProtectedRoute({ children }) {
    const { user } = useAuth()

    // Si no hay usuario autenticado, redirigir al login
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Si hay usuario autenticado, mostrar el contenido protegido
    return children
}

export default ProtectedRoute



