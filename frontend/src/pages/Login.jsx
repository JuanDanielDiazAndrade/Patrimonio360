import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import usePageAnimations from '../hooks/usePageAnimations.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { login } = useAuth()

  usePageAnimations()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // submitError: mensaje único que aparece solo tras intentar enviar
  const [submitError, setSubmitError] = useState('')
  // fieldErrors: solo marca qué campos tienen borde rojo, sin texto bajo el input
  const [fieldErrors, setFieldErrors] = useState({ email: false, password: false })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Iniciar Sesión · Patrimonio360°'
  }, [])

  // Al escribir, solo limpia el error general y el marcado rojo del campo
  function handleEmailChange(e) {
    setEmail(e.target.value)
    setFieldErrors((prev) => ({ ...prev, email: false }))
    setSubmitError('')
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value)
    setFieldErrors((prev) => ({ ...prev, password: false }))
    setSubmitError('')
  }

  // Clase del input — borde rojo si fieldErrors[field] es true
  function inputClass(field, extraPadding = 'pr-4') {
    return `w-full pl-12 ${extraPadding} py-3 rounded-xl border ${fieldErrors[field]
      ? 'border-red-300 ring-1 ring-red-400'
      : 'border-slate-200 dark:border-slate-700'
      } bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all`
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')

    // Validación local antes de llamar al backend
    const emailVacio = !email.trim()
    const emailInvalido = !emailRegex.test(email.trim())
    const passVacio = !password

    if (emailVacio || emailInvalido || passVacio) {
      setFieldErrors({
        email: emailVacio || emailInvalido,
        password: passVacio,
      })
      if (emailVacio) setSubmitError('El correo es obligatorio.')
      else if (emailInvalido) setSubmitError('Ingresa un correo válido (ej: usuario@dominio.com).')
      else setSubmitError('La contraseña es obligatoria.')
      return
    }

    setLoading(true)
    try {
      await login(email.trim(), password)
      // login() redirige automáticamente a /map si tiene éxito
    } catch (data) {
      // El contexto lanza el objeto de error del backend
      if (data?.errors) {
        const marks = { email: false, password: false }
        let firstMsg = ''
        data.errors.forEach((err) => {
          if (err.field in marks) {
            marks[err.field] = true
            if (!firstMsg) firstMsg = err.message
          }
        })
        setFieldErrors(marks)
        setSubmitError(firstMsg)
      } else {
        setFieldErrors({ email: true, password: true })
        setSubmitError(data?.message || 'Correo o contraseña incorrectos.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 justify-center items-center py-10 px-4 md:px-10">
            <div className="layout-content-container flex flex-col max-w-[1200px] w-full bg-white dark:bg-slate-900 shadow-2xl rounded-xl overflow-hidden md:flex-row min-h-[700px] pa-scale-in">

              {/* ── Panel izquierdo decorativo ── */}
              <div className="relative hidden md:flex md:w-1/2 bg-black overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover"
                  style={{
                    backgroundPosition: 'center 35%',
                    backgroundImage:
                      "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('/images/colpatria_tower.jpg')",
                  }}
                />
                <div className="relative z-10 flex flex-col justify-end p-12 h-full w-full">
                  <h1 className="text-4xl font-bold text-white mb-4">Patrimonio360°</h1>
                  <p className="text-lg text-white/90 leading-relaxed">
                    Continua contribuyendo en nuestra comunidad y ayúdanos a preservar el vibrante
                    tapiz del patrimonio cultural e histórico de Colombia para las futuras generaciones.
                  </p>
                  <div className="mt-8 flex gap-2">
                    <div className="w-12 h-1 bg-white rounded-full" />
                    <div className="w-2 h-1 bg-white/40 rounded-full" />
                    <div className="w-2 h-1 bg-white/40 rounded-full" />
                  </div>
                </div>
              </div>

              {/* ── Panel derecho: formulario ── */}
              <div className="flex flex-col w-full md:w-1/2 p-8 lg:p-12 justify-center">

                <div className="mb-8 pa-fade-up" data-pa-delay="1">
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Iniciar Sesión</h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Continua tu exploración de los tesoros de Colombia.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md pa-fade-up" data-pa-delay="2" noValidate>

                  {/* ── Correo ── */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <img src="/images/email_icon.png" alt="Icono email"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
                      <input
                        id="email" name="email" type="email"
                        placeholder="ejemplo@correo.com"
                        value={email} onChange={handleEmailChange}
                        aria-invalid={fieldErrors.email}
                        className={inputClass('email')}
                      />
                    </div>
                  </div>

                  {/* ── Contraseña ── */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Contraseña
                      </label>
                      <a href="#" className="text-xs text-slate-500 hover:text-black dark:hover:text-white transition-colors">
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                    <div className="relative">
                      <img src="/images/password_icon.png" alt="Icono contraseña"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
                      <input
                        id="password" name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password} onChange={handlePasswordChange}
                        aria-invalid={fieldErrors.password}
                        className={inputClass('password', 'pr-12')}
                      />
                      <img
                        src={showPassword ? '/images/closed_eye_icon.png' : '/images/open_eye_icon.png'}
                        alt="Mostrar contraseña"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer opacity-60 hover:opacity-100"
                      />
                    </div>
                  </div>

                  {/* ── Bloque de error único — solo aparece tras intentar enviar ── */}
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit" disabled={loading}
                    className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-black/25 transition-all flex justify-center items-center gap-2 disabled:opacity-60"
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </button>
                </form>

                <div className="mt-10 text-center pa-fade-up" data-pa-delay="3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    ¿No tienes una cuenta?{' '}
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