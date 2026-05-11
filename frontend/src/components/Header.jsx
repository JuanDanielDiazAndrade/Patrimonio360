import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
    const headerRef = useRef(null)

    // Animación de entrada del header (replicada de animations_index.js)
    useEffect(() => {
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
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 z-[1000] bg-white/50">
            <header
                ref={headerRef}
                className="container mx-auto px-4 py-6 flex items-center justify-between"
            >
                <div className="flex items-center">
                    <img className="h-10 w-auto" src="/images/large_logo.png" alt="Patrimonio360°" />
                </div>
                <nav className="hidden md:flex space-x-8 items-center">
                    <a className="text-gray-900 font-medium hover:text-gray-600" href="#podras_ver">
                        Explorar
                    </a>
                    <a className="text-gray-900 font-medium hover:text-gray-600" href="#">
                        Acerca de
                    </a>
                    <Link
                        className="bg-black text-white px-5 py-2 rounded-md font-medium hover:bg-gray-800 transition"
                        to="/login"
                    >
                        Iniciar sesión
                    </Link>
                </nav>
            </header>
        </div>
    )
}