import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Expresión regular para validar formato básico de correo: usuario@dominio.extensión
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
    // useNavigate permite redirigir al usuario sin recargar la página
    const navigate = useNavigate()

    // ── Estado del formulario ──
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)   // controla visibilidad de la contraseña
    const [errors, setErrors] = useState({ email: '', password: '' }) // mensajes de error por campo
    const [loading, setLoading] = useState(false)             // deshabilita el botón mientras se hace la petición

    // Cambia el título de la pestaña al montar el componente
    useEffect(() => {
        document.title = 'Patrimonio360° - Iniciar Sesión'
    }, [])

    // ── Funciones de validación ──────────────────────────────────
    // Reciben el valor actual del campo (por defecto toman el estado)
    // y retornan un string con el error, o vacío si es válido.
    // Esto permite usarlas tanto en tiempo real como al enviar el form.

    function validateEmail(value = email) {
        if (!value.trim()) return 'El correo es obligatorio.'
        if (!emailRegex.test(value.trim()))
            return 'Ingrese un correo válido (ej: usuario@dominio.com).'
        return ''
    }

    function validatePassword(value = password) {
        // En login solo se verifica que no esté vacía;
        // la validación real de credenciales ocurre en el servidor
        if (!value) return 'La contraseña es obligatoria.'
        return ''
    }

    // Genera la clase CSS del input según si tiene error o no.
    // extraPadding ajusta el padding derecho cuando hay ícono de ojo
    function inputClass(field, extraPadding = 'pr-4') {
        return `w-full pl-12 ${extraPadding} py-3 rounded-xl border ${errors[field]
            ? 'border-red-300 ring-1 ring-red-400'       // borde rojo si hay error
            : 'border-slate-200 dark:border-slate-700'   // borde normal si no hay error
            } bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all`
    }

    // ── Handlers de cambio en tiempo real ────────────────────────
    // Actualizan el estado y revalidan el campo mientras el usuario escribe

    function handleEmailChange(e) {
        const v = e.target.value
        setEmail(v)
        setErrors((prev) => ({ ...prev, email: validateEmail(v) }))
    }

    function handlePasswordChange(e) {
        const v = e.target.value
        setPassword(v)
        setErrors((prev) => ({ ...prev, password: validatePassword(v) }))
    }

    // ── Handler de envío del formulario ──────────────────────────
    async function handleSubmit(e) {
        e.preventDefault() // evita que el navegador recargue la página

        // Valida todos los campos antes de enviar
        const emailErr = validateEmail()
        const passErr = validatePassword()
        setErrors({ email: emailErr, password: passErr })

        // Si hay algún error, detiene el envío
        if (emailErr || passErr) return

        setLoading(true)
        try {
            // Petición POST al backend con las credenciales
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password }),
            })
            const data = await response.json()

            if (!response.ok) {
                // El servidor puede devolver errores por campo específico o un mensaje general
                if (data.errors) {
                    const newErrors = { email: '', password: '' }
                    data.errors.forEach((err) => {
                        if (err.field in newErrors) newErrors[err.field] = err.message
                    })
                    setErrors(newErrors)
                } else {
                    // Error genérico (ej: credenciales incorrectas)
                    setErrors((prev) => ({
                        ...prev,
                        password: data.message || 'Correo o contraseña incorrectos.',
                    }))
                }
                return
            }

            // Login exitoso: guarda el token y datos del usuario en localStorage
            // para mantener la sesión activa entre recargas de página
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))

            // Redirige a la página principal
            navigate('/')
        } catch (err) {
            // Error de red: el backend no está corriendo o hay problemas de conexión
            console.error('Error de conexión:', err)
            alert('No se pudo conectar con el servidor. Verifica tu conexión.')
        } finally {
            // Se ejecuta siempre, haya error o no, para rehabilitar el botón
            setLoading(false)
        }
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <div className="flex flex-1 justify-center items-center py-10 px-4 md:px-10">

                        {/* Contenedor principal: columna en móvil, dos paneles en escritorio */}
                        <div className="layout-content-container flex flex-col max-w-[1200px] w-full bg-white dark:bg-slate-900 shadow-2xl rounded-xl overflow-hidden md:flex-row min-h-[700px]">

                            {/* ── PANEL IZQUIERDO: imagen decorativa (solo visible en escritorio) ── */}
                            <div className="relative hidden md:flex md:w-1/2 bg-black overflow-hidden">

                                {/* Imagen de fondo con degradado oscuro para mejorar legibilidad del texto.
                                    backgroundPosition al 35% vertical encuadra mejor la torre */}
                                <div
                                    className="absolute inset-0 bg-cover"
                                    style={{
                                        backgroundPosition: 'center 35%',
                                        backgroundImage:
                                            "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('/images/colpatria_tower.jpg')",
                                    }}
                                />

                                {/* Texto superpuesto, anclado al fondo del panel */}
                                <div className="relative z-10 flex flex-col justify-end p-12 h-full w-full">
                                    <h1 className="text-4xl font-bold text-white mb-4">Patrimonio360°</h1>
                                    <p className="text-lg text-white/90 leading-relaxed">
                                        Continua contribuyendo en nuestra comunidad y ayúdanos a preservar el vibrante
                                        tapiz del patrimonio cultural e histórico de Colombia para las futuras
                                        generaciones.
                                    </p>
                                    {/* Indicador decorativo tipo paginación (puntos de carrusel visual) */}
                                    <div className="mt-8 flex gap-2">
                                        <div className="w-12 h-1 bg-white rounded-full" />
                                        <div className="w-2 h-1 bg-white/40 rounded-full" />
                                        <div className="w-2 h-1 bg-white/40 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* ── PANEL DERECHO: formulario de inicio de sesión ── */}
                            <div className="flex flex-col w-full md:w-1/2 p-8 lg:p-12 justify-center">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold tracking-tight mb-2">Iniciar Sesión</h2>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        Continua tu exploración de los tesoros de Colombia.
                                    </p>
                                </div>

                                {/* noValidate desactiva la validación nativa del navegador;
                                    toda la validación se maneja en los handlers de arriba */}
                                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md" noValidate>

                                    {/* ── Campo: Correo electrónico ── */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Correo Electrónico
                                        </label>
                                        <div className="relative">
                                            {/* Ícono posicionado absolutamente dentro del input */}
                                            <img
                                                src="/images/email_icon.png"
                                                alt="Icono email"
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60"
                                            />
                                            {/* aria-invalid y aria-describedby mejoran la accesibilidad
                                                para lectores de pantalla */}
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="ejemplo@correo.com"
                                                value={email}
                                                onChange={handleEmailChange}
                                                aria-invalid={!!errors.email}
                                                aria-describedby="emailError"
                                                className={inputClass('email')}
                                            />
                                        </div>
                                        {/* Mensaje de error: solo se renderiza si hay un error */}
                                        {errors.email && (
                                            <p id="emailError" className="text-red-500 text-xs mt-1" role="alert">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* ── Campo: Contraseña ── */}
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                Contraseña
                                            </label>
                                            {/* Enlace de recuperación alineado a la derecha del label */}
                                            <a
                                                href="#"
                                                className="text-xs text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </a>
                                        </div>
                                        <div className="relative">
                                            <img
                                                src="/images/password_icon.png"
                                                alt="Icono contraseña"
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60"
                                            />
                                            {/* type cambia entre 'password' y 'text' según showPassword */}
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={handlePasswordChange}
                                                aria-invalid={!!errors.password}
                                                aria-describedby="passwordError"
                                                className={inputClass('password', 'pr-12')}
                                            />
                                            {/* Ícono de ojo: alterna visibilidad de la contraseña al hacer click */}
                                            <img
                                                src={showPassword ? '/images/closed_eye_icon.png' : '/images/open_eye_icon.png'}
                                                alt="Mostrar contraseña"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer opacity-60 hover:opacity-100"
                                            />
                                        </div>
                                        {errors.password && (
                                            <p id="passwordError" className="text-red-500 text-xs mt-1" role="alert">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* ── Botón de envío ──
                                        Se deshabilita mientras loading=true para evitar doble envío */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-black/25 transition-all flex justify-center items-center gap-2 disabled:opacity-60"
                                    >
                                        {/* Cambia el texto según si está procesando o no */}
                                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                    </button>
                                </form>

                                <div className="relative my-8" />

                                {/* Enlace de redirección para usuarios sin cuenta */}
                                <div className="mt-10 text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        ¿No tienes una cuenta?{' '}
                                        {/* Link de React Router: no recarga la página */}
                                        <Link className="text-black font-semibold hover:underline ml-1" to="/register">
                                            Regístrate aquí
                                        </Link>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}