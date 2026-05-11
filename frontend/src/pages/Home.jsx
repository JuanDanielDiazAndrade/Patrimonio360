import { useEffect } from 'react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import useAnimations from '../hooks/useAnimations.js'

export default function Home() {
  // Activa las animaciones de scroll y hover definidas en el hook
  useAnimations()

  // Cambia el título de la pestaña del navegador al montar el componente
  useEffect(() => {
    document.title = 'Patrimonio360°'
  }, [])

  return (
    <div className="bg-white">
      {/* Encabezado fijo con logo y navegación */}
      <Header />

      <main>
        {/* ── SECCIÓN HERO ──────────────────────────────────────────
            Título principal, descripción, botón CTA e imagen destacada */}
        <section className="container mx-auto px-4 py-16 md:py-24 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-black">
            Patrimonio360°
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
            Descubre los tesoros culturales de Colombia a través de un viaje interactivo.
          </p>

          {/* Botón principal de llamada a la acción */}
          <a href="/login" className="bg-black text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-gray-800 transition mb-16 inline-block">
            Ver mapa
          </a>

          {/* Imagen hero del Parque Tayrona */}
          <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/images/tayrona.jpg"
              alt="Parque Tayrona"
              className="w-full h-auto object-cover aspect-video md:aspect-[2/1]"
            />
          </div>
        </section>

        {/* ── SECCIÓN CARACTERÍSTICAS ───────────────────────────────
            Tres tarjetas que describen las funciones principales:
            mapa interactivo, modelos 3D e información histórica.
            El id="podras_ver" es el ancla del link "Explorar" del Header */}
        <section className="container mx-auto px-4 py-20" id="podras_ver">
          <h2 className="text-3xl font-bold text-center mb-16">Podras ver...</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">

            {/* Tarjeta: Mapa Interactivo */}
            <div className="flex flex-col items-center feature-item">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <img src="/images/colombia_map_icon.png" alt="Mapa de Colombia" className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold mb-3">Mapa Interactivo</h3>
              <p>Explora ubicaciones patrimoniales en toda Colombia de forma interactiva.</p>
            </div>

            {/* Tarjeta: Modelos 3D */}
            <div className="flex flex-col items-center feature-item">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <img src="/images/3d_icon.png" alt="3D" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Modelos 3D y Visualizaciones</h3>
              <p>Experimenta monumentos y artefactos históricos en detalle tridimensional.</p>
            </div>

            {/* Tarjeta: Información Histórica */}
            <div className="flex flex-col items-center feature-item">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <img src="/images/scroll_icon.png" alt="Pergamino" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Información Histórica</h3>
              <p>Sumérgete en la rica historia de Colombia con información detallada.</p>
            </div>

          </div>
        </section>

        {/* ── SECCIÓN EXPLORA ───────────────────────────────────────
            Bloque de texto + imagen en dos columnas.
            Invita al usuario a planificar su visita o ver la galería */}
        <section className="container mx-auto px-4 py-20 border-t border-gray-100">
          <div className="flex flex-col md:flex-row gap-12 items-center max-w-6xl mx-auto">

            {/* Columna izquierda: texto y botones */}
            <div className="md:w-1/2 pr-0 md:pr-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Explora Nuestras Joyas</h2>
              <p className="text-lg mb-8 text-gray-600">
                Sumérgete en el diverso patrimonio cultural de Colombia. Desde antiguas maravillas
                arqueológicas hasta vibrantes ciudades coloniales, hay algo para que todos descubran
                y aprendan.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition"
                  href="#"
                >
                  Planifica tu Visita
                </a>
                <a
                  className="bg-gray-100 text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition"
                  href="#"
                >
                  Ver Galería
                </a>
              </div>
            </div>

            {/* Columna derecha: imagen del Cristo Rey */}
            <div className="md:w-1/2 w-full">
              <img
                src="/images/cristo_rey.jpg"
                alt="Estatua Cristo Rey"
                className="w-full h-auto rounded-2xl object-cover shadow-lg aspect-[4/3]"
              />
            </div>

          </div>
        </section>

        {/* ── SECCIÓN HIGHLIGHTS ────────────────────────────────────
            Dos tarjetas con imagen y descripción sobre experiencias
            culturales destacadas: tradiciones locales y eventos */}
        <section className="container mx-auto px-4 py-20 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Experiencias Destacadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Tarjeta: Tradiciones Locales — la clase highlight-card
                  es detectada por useAnimations para la animación de scroll */}
              <div className="flex flex-col group cursor-pointer highlight-card">
                <div className="overflow-hidden rounded-2xl mb-6">
                  {/* group-hover:scale-105 aplica zoom a la imagen al pasar el mouse */}
                  <img
                    src="/images/wayuu_bags.jpg"
                    alt="Mochilas Wayuu"
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 aspect-[3/2]"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3">Tradiciones Locales</h3>
                <p className="text-gray-600">
                  Aprende sobre las costumbres, artesanías y música únicas de diferentes regiones
                  colombianas.
                </p>
              </div>

              {/* Tarjeta: Eventos Culturales */}
              <div className="flex flex-col group cursor-pointer highlight-card">
                <div className="overflow-hidden rounded-2xl mb-6">
                  <img
                    src="/images/barranquilla_carnival.jpg"
                    alt="Carnaval de Barranquilla"
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 aspect-[3/2]"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3">Eventos culturales</h3>
                <p className="text-gray-600">
                  Descubre las vibrantes fiestas y celebraciones que muestran la diversidad cultural
                  de Colombia.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ── SECCIÓN TESTIMONIOS ───────────────────────────────────
            Array de testimonios renderizado con .map() para evitar
            repetir el mismo bloque JSX tres veces */}
        <section className="container mx-auto px-4 py-20 bg-gray-50 rounded-3xl mb-12 max-w-7xl">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Lo que dicen nuestros usuarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Datos de cada testimonio: texto e rol del usuario */}
              {[
                {
                  text: '"Patrimonio360° ha transformado mi forma de aprender sobre historia. Los modelos 3D son increíbles."',
                  role: 'Estudiante de Historia',
                },
                {
                  text: '"Pude planificar mi viaje a Colombia usando esta plataforma. Fue de mucha ayuda para descubrir nuevos lugares."',
                  role: 'Turista',
                },
                {
                  text: '"Excelente recurso para educadores. Mis alumnos disfrutan explorando el patrimonio interactivo."',
                  role: 'Profesora',
                },
              ].map((t, i) => (
                // key={i} identifica cada tarjeta de forma única en el DOM virtual
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between testimonial-card"
                >
                  <p className="text-gray-700 italic mb-8">{t.text}</p>
                  <div className="flex items-center gap-4">
                    {/* Avatar genérico, todos los testimonios son anónimos */}
                    <img src="/images/avatar.jpg" alt="Avatar" className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-bold text-sm">Anónimo</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

      </main>

      {/* Pie de página con CTA, redes sociales y copyright */}
      <Footer />
    </div>
  )
}