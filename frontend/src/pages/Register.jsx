import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import usePageAnimations from '../hooks/usePageAnimations.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,}$/

export default function Register() {
  const navigate = useNavigate()

  usePageAnimations()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [terms, setTerms] = useState(false)
  // submitError: mensaje único visible solo tras intentar enviar
  const [submitError, setSubmitError] = useState('')
  // fieldErrors: solo controla el borde rojo de cada input, sin texto debajo
  const [fieldErrors, setFieldErrors] = useState({
    name: false, email: false, password: false, confirm: false, terms: false,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Registrarse · Patrimonio360°'
  }, [])

  // Al escribir en cualquier campo, limpia el error general y el marcado del campo
  function clearField(field) {
    setFieldErrors((prev) => ({ ...prev, [field]: false }))
    setSubmitError('')
  }

  function inputClass(field, extraPadding = 'pr-4') {
    return `w-full pl-12 ${extraPadding} py-3 rounded-xl border ${fieldErrors[field]
      ? 'border-red-300 ring-1 ring-red-400'
      : 'border-slate-200 dark:border-slate-700'
      } bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all`
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')

    // ── Validación local completa ──
    const marks = {
      name: !name.trim(),
      email: !email.trim() || !emailRegex.test(email.trim()),
      password: !password || !passwordRegex.test(password),
      confirm: !confirmPassword || confirmPassword !== password,
      terms: !terms,
    }
    setFieldErrors(marks)

    // Muestra el primer error encontrado en orden de aparición en el form
    if (marks.name) { setSubmitError('El nombre es obligatorio.'); return }
    if (!email.trim()) { setSubmitError('El correo es obligatorio.'); return }
    if (marks.email) { setSubmitError('Ingresa un correo válido (ej: usuario@dominio.com).'); return }
    if (!password) { setSubmitError('La contraseña es obligatoria.'); return }
    if (marks.password) { setSubmitError('Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.'); return }
    if (!confirmPassword) { setSubmitError('Debes confirmar la contraseña.'); return }
    if (marks.confirm) { setSubmitError('Las contraseñas no coinciden.'); return }
    if (marks.terms) { setSubmitError('Debes aceptar los términos y condiciones.'); return }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          const marks = { name: false, email: false, password: false, confirm: false, terms: false }
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
          setSubmitError(data.message || 'Ocurrió un error. Inténtalo de nuevo.')
        }
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch (err) {
      console.error('Error de conexión:', err)
      setSubmitError('No se pudo conectar con el servidor. Verifica tu conexión.')
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
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('/images/cartagena_street.jpg')",
                  }}
                />
                <div className="relative z-10 flex flex-col justify-end p-12 h-full w-full">
                  <h1 className="text-4xl font-bold text-white mb-4">Patrimonio360°</h1>
                  <p className="text-lg text-white/90 leading-relaxed">
                    Únete a nuestra comunidad y ayúdanos a preservar el vibrante tapiz del
                    patrimonio cultural e histórico de Colombia para las futuras generaciones.
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
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Crear Cuenta</h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Comienza tu exploración de los tesoros de Colombia hoy mismo.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md pa-fade-up" data-pa-delay="2" noValidate>

                  {/* ── Nombre ── */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <img src="/images/user_icon.png" alt="Icono usuario"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
                      <input
                        id="name" name="name" type="text"
                        placeholder="Juan Pérez"
                        value={name}
                        onChange={(e) => { setName(e.target.value); clearField('name') }}
                        aria-invalid={fieldErrors.name}
                        className={inputClass('name')}
                      />
                    </div>
                  </div>

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
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); clearField('email') }}
                        aria-invalid={fieldErrors.email}
                        className={inputClass('email')}
                      />
                    </div>
                  </div>

                  {/* ── Contraseña + Confirmar ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Contraseña
                      </label>
                      <div className="relative">
                        <img src="/images/password_icon.png" alt="Icono contraseña"
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
                        <input
                          id="password" name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); clearField('password'); clearField('confirm') }}
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

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Confirmar Contraseña
                      </label>
                      <div className="relative">
                        <img src="/images/confirm_password_icon.png" alt="Icono confirmar contraseña"
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
                        <input
                          id="confirmPassword" name="confirmPassword"
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); clearField('confirm') }}
                          aria-invalid={fieldErrors.confirm}
                          className={inputClass('confirm', 'pr-12')}
                        />
                        <img
                          src={showConfirm ? '/images/closed_eye_icon.png' : '/images/open_eye_icon.png'}
                          alt="Mostrar contraseña"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer opacity-60 hover:opacity-100"
                        />
                      </div>
                    </div>

                  </div>

                  {/* ── Términos y condiciones ── */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start gap-3">
                      <label className="relative flex items-center cursor-pointer mt-1">
                        <input
                          id="terms" name="terms" type="checkbox"
                          checked={terms}
                          onChange={(e) => { setTerms(e.target.checked); clearField('terms') }}
                          aria-invalid={fieldErrors.terms}
                          className="sr-only peer"
                        />
                        <span
                          className={`
                              w-4 h-4 rounded border-2 flex items-center justify-center shrink-0
                              transition-all duration-200
                              ${terms
                              ? 'bg-black border-black scale-110'
                              : fieldErrors.terms
                                ? 'bg-white border-red-400'
                                : 'bg-white border-slate-300'
                            }
                                                    `}
                          style={terms ? { animation: 'checkBounce 0.3s cubic-bezier(0.22,1,0.36,1)' } : {}}
                        >
                          <svg
                            viewBox="0 0 12 10"
                            className={`w-2.5 h-2.5 text-white transition-all duration-200 ${terms ? 'opacity-100' : 'opacity-0'}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={terms ? { animation: 'checkDraw 0.25s ease forwards 0.05s' } : {}}
                          >
                            <path
                              d="M1 5l3.5 3.5L11 1"
                              strokeDasharray="20"
                              strokeDashoffset={terms ? '0' : '20'}
                              style={{ transition: 'stroke-dashoffset 0.25s ease 0.05s' }}
                            />
                          </svg>
                        </span>
                      </label>
                      <label htmlFor="terms"
                        className="text-xs text-slate-500 dark:text-slate-400 leading-normal cursor-pointer">
                        Acepto los{' '}
                        <a href="#" className="text-black font-semibold hover:underline">
                          Términos de Servicio
                        </a>{' '}
                        y la{' '}
                        <a href="#" className="text-black font-semibold hover:underline">
                          Política de Privacidad
                        </a>
                        .
                      </label>
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
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-black/25 transition-all flex justify-center items-center gap-2 disabled:opacity-60"
                  >
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </button>

                </form>

                <div className="relative my-8" />

                <div className="mt-10 text-center pa-fade-up" data-pa-delay="3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    ¿Ya tienes una cuenta?{' '}
                    <Link className="text-black font-semibold hover:underline ml-1" to="/login">
                      Inicia sesión aquí
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