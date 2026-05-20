import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Permite el acceso solo si el usuario tiene role === 'admin'.
// - Sin sesión        → redirige a /login
// - Sesión de usuario → redirige a /map
// - Sesión de admin   → renderiza el children normalmente
export default function AdminRoute({ children }) {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" replace />
    if (user.role !== 'admin') return <Navigate to="/map" replace />
    return children
}