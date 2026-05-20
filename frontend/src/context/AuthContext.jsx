import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Contexto global de autenticación — accesible desde cualquier componente con useAuth()
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const navigate = useNavigate()

    // Inicializa el estado leyendo localStorage para persistir la sesión entre recargas
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user')
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    })

    // Llama al backend, guarda token + usuario en localStorage y actualiza el estado
    const login = async (email, password) => {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        const data = await response.json()

        if (!response.ok) throw data // Login.jsx captura esto para mostrar errores

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        navigate('/map')
    }

    // Limpia localStorage, resetea el estado y redirige al inicio
    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        navigate('/')
    }

    // token para adjuntarlo en peticiones protegidas del backend
    const token = localStorage.getItem('token')

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook para consumir el contexto fácilmente: const { user, logout } = useAuth()
export function useAuth() {
    return useContext(AuthContext)
}