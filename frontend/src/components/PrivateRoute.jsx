import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Envuelve rutas que requieren sesión activa.
// Si el usuario no está logueado, lo manda a /login.
// Uso en App.jsx:  <Route path="/map" element={<PrivateRoute><Map /></PrivateRoute>} />
export default function PrivateRoute({ children }) {
    const { user } = useAuth()
    return user ? children : <Navigate to="/login" replace />
}