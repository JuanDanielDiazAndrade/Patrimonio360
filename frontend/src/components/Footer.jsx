import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-6xl mb-16">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 md:mb-0">Comienza tu Aventura Hoy</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition"
              to="/register"
            >
              Crear Cuenta
            </Link>
            <a
              className="bg-transparent border border-gray-300 text-black px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition"
              href="#"
            >
              Más información
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between gap-12">
        <div className="md:w-1/3">
          <div className="font-bold text-xl tracking-tight mb-4">Patrimonio360°</div>
          <div className="flex gap-4 mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">fb</div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">tw</div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">ig</div>
          </div>
          <p className="text-sm text-gray-500">© 2026 Patrimonio360°. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer >
  )
}