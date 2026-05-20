import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import usePageAnimations from '../hooks/usePageAnimations.js'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// ── Iconos consistentes — outline, strokeWidth 1.5, color heredado ──
const Icons = {
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Location: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  Ticket: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
    </svg>
  ),
  Globe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12a8.959 8.959 0 01.284-2.253" />
    </svg>
  ),
  Book: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  Map: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
  ),
  ExternalLink: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  ),
}

// Colores por categoría
const CATEGORIA_COLORS = {
  natural: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  cultural: 'bg-violet-50  text-violet-700  ring-1 ring-violet-200',
  histórico: 'bg-amber-50   text-amber-700   ring-1 ring-amber-200',
  arqueológico: 'bg-pink-50  text-pink-700  ring-1 ring-pink-200',
  religioso: 'bg-blue-50    text-blue-700    ring-1 ring-blue-200',
  urbano: 'bg-slate-100  text-slate-700   ring-1 ring-slate-200',
}

// Iconos por categoría
const CATEGORIA_ICONS = {
  natural: {
    bg: '#d1fae5', border: '#6ee7b7',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#059669" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22V12m0 0C12 7 7 4 3 6c0 5 4 8 9 6zm0 0c0-5 5-8 9-6-1 5-5 8-9 6z"/>
        </svg>`,
  },
  cultural: {
    bg: '#ede9fe', border: '#c4b5fd',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 9l10-6 10 6 M6 13v5M10 13v5M14 13v5M18 13v5 M4 9h16M2 21h20M4 13h16"/>
        </svg>`,
  },
  histórico: {
    bg: '#fef3c7', border: '#fcd34d',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#d97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4.5H6.5C5 4.5 4.5 5.5 4.5 7C4.5 8.5 5 9.5 6.5 9.5H17.5C19 9.5 19.5 10.5 19.5 12C19.5 13.5 19 14.5 17.5 14.5H6.5C5 14.5 4.5 15.5 4.5 17C4.5 18.5 5 19.5 6.5 19.5H16"/>
        </svg>`,
  },
  arqueológico: {
    bg: '#fdf2f8', border: '#fbcfe8',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#db2777" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 2h8M9 2v3c0 2-3 3-3 6v6a6 6 0 0 0 12 0v-6c0-3-3-4-3-6V2"/>
        </svg>`,
  },
  religioso: {
    bg: '#dbeafe', border: '#93c5fd',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 0v8M9 3h6M5 22h14M5 22V11l7-5 7 5v11M10 22v-5h4v5"/>
        </svg>`,
  },
  urbano: {
    bg: '#f1f5f9', border: '#94a3b8',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#475569" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18M5 21V7l5-4v18M14 21V11l5-3v13"/>
        </svg>`,
  },
}

function Map() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [sitioSeleccionado, setSitioSeleccionado] = useState(null)
  const [esSatelital, setEsSatelital] = useState(false)
  const { token } = useAuth()

  // Animaciones
  usePageAnimations()

  useEffect(() => {

    document.title = 'Mapa · Patrimonio360°'

    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [-74.2973, 4.5709],
      zoom: 5,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
    map.current.addControl(new mapboxgl.FullscreenControl())

    map.current.on('load', () => {
      map.current.setConfigProperty('basemap', 'lightPreset', 'day')
      map.current.easeTo({ pitch: 45, bearing: -17.6, duration: 1000 })
      cargarSitios()
    })
  }, [])

  const cambiarEstilo = () => {
    if (esSatelital) {
      map.current.setStyle('mapbox://styles/mapbox/standard')
      map.current.easeTo({ pitch: 45, bearing: -17.6, duration: 1000 })
    } else {
      map.current.setStyle('mapbox://styles/mapbox/satellite-streets-v12')
      map.current.easeTo({ pitch: 0, bearing: 0, duration: 1000 })
    }
    setEsSatelital(!esSatelital)
  }

  const cargarSitios = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/locations')
      const data = await response.json()
      if (data.success && data.data.length > 0) agregarMarcadores(data.data)
    } catch (error) {
      console.error('Error cargando sitios:', error)
    }
  }

  const agregarMarcadores = (sitios) => {
    sitios.forEach(sitio => {
      const { bg, border, svg } = CATEGORIA_ICONS[sitio.category] || {
        bg: '#f3f4f6', border: '#9ca3af',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>`,
      }

      const el = document.createElement('div')
      el.style.cssText = `width:30px;height:30px;background:${bg};border:2px solid ${border};border-radius:50%;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;`
      el.innerHTML = svg

      new mapboxgl.Marker(el, { anchor: 'center' })
        .setLngLat([sitio.coordinates.lng, sitio.coordinates.lat])
        .addTo(map.current)

      el.addEventListener('click', () => {
        setSitioSeleccionado(sitio)
        map.current.flyTo({
          center: [sitio.coordinates.lng, sitio.coordinates.lat],
          zoom: 17,
          duration: 1500,
        })
      })
    })
  }

  const s = sitioSeleccionado

  return (
    <div className="flex flex-col w-full h-screen">
      <Header />

      <div className="relative flex-1">
        <div ref={mapContainer} className="w-full h-full" />

        {/* Botón vista satelital */}
        <button
          onClick={cambiarEstilo}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white border border-gray-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-md pa-fade-right" data-pa-delay="0"
        >
          {esSatelital ? 'Vista Normal' : 'Vista Satelital'}
        </button>

        {/* ── Panel lateral ── */}
        {s && (
          <div className="absolute top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-20 flex flex-col"
            style={{ animation: 'panelSlideIn 0.35s cubic-bezier(0.22,1,0.36,1)' }}>

            {/* Imagen de portada */}
            <div className="relative w-full h-60 bg-gray-100 shrink-0 overflow-hidden">
              <img
                src={s.image || '/images/default.jpg'}
                alt={s.name}
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.85) contrast(1.05) brightness(0.97)' }}
                onError={(e) => { e.currentTarget.src = '/images/default.jpg' }}
              />
              {/* Gradiente para que el botón cerrar sea legible sobre cualquier imagen */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-amber-900/5 to-black/15" />

              {/* Botón cerrar */}
              <button
                onClick={() => setSitioSeleccionado(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition shadow-sm"
              >
                <Icons.Close />
              </button>

              {/* Badge de categoría sobre la imagen */}
              <div className="absolute bottom-4 left-4">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize backdrop-blur-sm ${CATEGORIA_COLORS[s.category] || 'bg-white/90 text-gray-700'
                  }`}>
                  {s.category}
                </span>
              </div>
            </div>

            {/* Contenido scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">

                {/* Nombre + ubicación */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                    {s.name}
                  </h2>
                  <div className="flex items-start gap-2 text-gray-500">
                    <span className="mt-0.5 shrink-0"><Icons.Location /></span>
                    <p className="text-sm leading-relaxed">{s.location}</p>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                {/* Detalles rápidos — solo los que existan */}
                {(s.yearBuilt || s.entryPrice || s.website) && (
                  <div className="grid grid-cols-1 gap-3">
                    {s.yearBuilt && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <span className="text-gray-400 mt-0.5 shrink-0"><Icons.Calendar /></span>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Construcción</p>
                          <p className="text-sm text-gray-700">{s.yearBuilt}</p>
                        </div>
                      </div>
                    )}
                    {s.entryPrice && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <span className="text-gray-400 mt-0.5 shrink-0"><Icons.Ticket /></span>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Precio de entrada</p>
                          <p className="text-sm text-gray-700">{s.entryPrice}</p>
                        </div>
                      </div>
                    )}
                    {s.website && (
                      <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <span className="text-gray-400 mt-0.5 shrink-0"><Icons.Globe /></span>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Sitio web oficial</p>
                          <a href={s.website} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-gray-900 font-medium hover:underline underline-offset-2 break-all">
                            {s.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Contexto histórico */}
                {s.historicalContext && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-gray-400"><Icons.Book /></span>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Historia y cultura
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {s.historicalContext}
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* Botón fijo en el fondo — siempre visible */}
            <div className="p-4 border-t border-gray-100 bg-white shrink-0">
              <a
                href={s.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gray-900 text-white text-center py-3 rounded-xl text-sm font-semibold hover:bg-black transition flex items-center justify-center gap-2"
              >
                <Icons.Map />
                Ver en Google Maps
                <Icons.ExternalLink />
              </a>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Map