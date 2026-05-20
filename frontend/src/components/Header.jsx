import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function getPastelColor(letter) {
  const colors = {
    A: '#FFB3BA', B: '#FFD9B3', C: '#FFFCB3', D: '#B3FFB9', E: '#B3F0FF',
    F: '#B3C6FF', G: '#D9B3FF', H: '#FFB3F0', I: '#FFB3C6', J: '#FFDDB3',
    K: '#F0FFB3', L: '#B3FFE0', M: '#B3E0FF', N: '#C6B3FF', Ñ: '#E0FFFF',
    O: '#FFB3D9', P: '#FFE0B3', Q: '#E0FFB3', R: '#B3FFD9', S: '#B3D9FF',
    T: '#D9B3FF', U: '#FFB3E0', V: '#FFD0B3', W: '#D0FFB3', X: '#B3FFD0',
    Y: '#B3CCFF', Z: '#FFB3CC',
  }
  return colors[letter?.toUpperCase()] || '#E0E0E0'
}

export default function Header() {
  const headerRef = useRef(null)
  const [menuAbierto, setMenuAbierto] = useState(false)

  const { user, logout } = useAuth()
  const { pathname } = useLocation()

  const inicial = user?.name ? user.name.charAt(0).toUpperCase() : '?'
  const colorFondo = getPastelColor(inicial)

  const esHome = pathname === '/'
  const esMapa = pathname === '/map'
  const esAdmin = pathname === '/admin'

  useEffect(() => {
    if (!esHome) return
    const el = headerRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(-20px)'
    el.style.transition = 'all 0.6s ease'
    const timer = setTimeout(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, 200)
    return () => clearTimeout(timer)
  }, [esHome])

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('#header-avatar-menu')) setMenuAbierto(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const wrapperClass = esHome
    ? 'fixed top-0 left-0 right-0 z-[1000]'
    : 'sticky top-0 z-[1000]'

  return (
    <div className={wrapperClass}>
      <header
        ref={headerRef}
        className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between"
      >
        {/* ── LOGO + etiqueta de sección ── */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <img className="h-8 w-auto" src="/images/large_logo.png" alt="Patrimonio360°" />
          </Link>

          {(esMapa || esAdmin) && (
            <div className="flex items-center gap-2">
              <span className="text-gray-300">|</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {esMapa && 'Explorador'}
                {esAdmin && 'Panel Admin'}
              </span>
            </div>
          )}
        </div>

        {/* ── NAV DERECHA ── */}
        <nav className="flex items-center gap-6">

          {esHome && (
            <>
              <a className="text-gray-900 font-medium hover:text-gray-600 transition text-sm" href="#podras_ver">
                Explorar
              </a>
              <a className="text-gray-900 font-medium hover:text-gray-600 transition text-sm" href="#">
                Acerca de
              </a>
            </>
          )}

          {esMapa && (
            <Link to="/" className="text-sm font-medium text-gray-500 hover:text-black transition">
              ← Volver
            </Link>
          )}

          {/* ── Avatar / botón de sesión ── */}
          {user ? (
            <div id="header-avatar-menu" className="relative">

              {/* Círculo con la inicial */}
              <button
                onClick={() => setMenuAbierto((v) => !v)}
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold font-display text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-transform hover:scale-105"
                style={{ backgroundColor: colorFondo, color: '#1a1a1a' }}
                title={user.name}
              >
                {inicial}
              </button>

              {/* ── Menú desplegable ──
              Siempre en el DOM — la visibilidad se controla con
              opacity + scale + pointer-events para que tanto la
              animación de entrada como la de salida sean visibles. */}
              <div
                className={`
                    absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg
                    border border-gray-100 overflow-hidden z-50
                    transition-all duration-200 ease-out origin-top-right
                    ${menuAbierto
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                  }
                `}
              >
                {/* Nombre y correo */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                {!esMapa && (
                  <Link
                    to="/map"
                    onClick={() => setMenuAbierto(false)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Ir al mapa
                  </Link>
                )}

                {user.role === 'admin' && !esAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuAbierto(false)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 border-t border-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Panel de administrador
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2 border-t border-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                  </svg>
                  Cerrar sesión
                </button>
              </div>

            </div>
          ) : (
            <Link
              className="bg-black text-white px-5 py-2 rounded-md font-medium hover:bg-gray-800 transition text-sm"
              to="/login"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </header>
    </div>
  )
}