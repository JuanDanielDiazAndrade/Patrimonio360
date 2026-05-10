// Componente raíz de la aplicación.
// Define las rutas principales usando React Router:
// - "/"          → página de inicio (Home)
// - "/login"     → formulario de inicio de sesión
// - "/register"  → formulario de registro
// - "/mapa"      → mapa interactivo
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Mapa from './pages/Mapa.jsx'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mapa" element={<Mapa />} />
        </Routes>
    )
}