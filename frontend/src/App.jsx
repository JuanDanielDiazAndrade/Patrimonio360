import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Map from './pages/Map.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
    return (
        // AuthProvider debe envolver todas las rutas para que useAuth() funcione en cualquier página
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Solo usuarios con sesión activa */}
                <Route path="/map" element={
                    <PrivateRoute><Map /></PrivateRoute>
                } />

                {/* Solo usuarios con role === 'admin' */}
                <Route path="/admin" element={
                    <AdminRoute><Admin /></AdminRoute>
                } />
            </Routes>
        </AuthProvider>
    )
}