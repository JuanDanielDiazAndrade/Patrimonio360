import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import usePageAnimations from '../hooks/usePageAnimations.js'

// ── Iconos consistentes — todos outline, strokeWidth 1.5, color heredado ──
const Icons = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4.5 1.318 1.318-4.5L16.862 3.487z" />
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Pin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  ),
}

const CAMPOS = [
  { key: 'name', label: 'Nombre', placeholder: 'Ej: Parque Tayrona', required: true, textarea: false },
  { key: 'description', label: 'Descripción', placeholder: 'Descripción breve del sitio...', required: true, textarea: true },
  { key: 'location', label: 'Ubicación', placeholder: 'Ej: Magdalena - Santa Marta, km 20...', required: true, textarea: false },
  { key: 'googleMapsUrl', label: 'Google Maps URL', placeholder: 'https://maps.app.goo.gl/...', required: true, textarea: false },
  { key: 'image', label: 'URL de imagen', placeholder: 'https://... (dejar vacío si no hay)', required: false, textarea: false },
  { key: 'historicalContext', label: 'Contexto histórico y cultural', placeholder: 'Historia, significado cultural, patrimonio...', required: false, textarea: true },
  { key: 'yearBuilt', label: 'Fecha / período de construcción', placeholder: 'Ej: Siglo XVI, 1969, 200 a.C.', required: false, textarea: false },
  { key: 'entryPrice', label: 'Precio de entrada', placeholder: 'Ej: Gratuito, $22.000 COP', required: false, textarea: false },
  { key: 'website', label: 'Página web oficial', placeholder: 'https://www.sitio.gov.co', required: false, textarea: false },
]

const CATEGORIAS = ['natural', 'cultural', 'histórico', 'arqueológico', 'religioso', 'urbano']

// Colores por categoría para el badge
const CATEGORIA_COLORS = {
  natural: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  cultural: 'bg-violet-50  text-violet-700  ring-1 ring-violet-200',
  histórico: 'bg-amber-50   text-amber-700   ring-1 ring-amber-200',
  arqueológico: 'bg-pink-50  text-pink-700  ring-1 ring-pink-200',
  religioso: 'bg-blue-50    text-blue-700    ring-1 ring-blue-200',
  urbano: 'bg-slate-100  text-slate-700   ring-1 ring-slate-200',
}

const CATEGORIA_ICONS_SVG = {
  natural: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12m0 0C12 7 7 4 3 6c0 5 4 8 9 6zm0 0c0-5 5-8 9-6-1 5-5 8-9 6z" />
    </svg>
  ),
  cultural: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9l10-6 10 6 M6 13v5M10 13v5M14 13v5M18 13v5 M4 9h16M2 21h20M4 13h16" />
    </svg>
  ),
  histórico: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4.5H6.5C5 4.5 4.5 5.5 4.5 7C4.5 8.5 5 9.5 6.5 9.5H17.5C19 9.5 19.5 10.5 19.5 12C19.5 13.5 19 14.5 17.5 14.5H6.5C5 14.5 4.5 15.5 4.5 17C4.5 18.5 5 19.5 6.5 19.5H16" />
    </svg>
  ),
  arqueológico: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2h8M9 2v3c0 2-3 3-3 6v6a6 6 0 0 0 12 0v-6c0-3-3-4-3-6V2" />
    </svg>
  ),
  religioso: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 0v8M9 3h6M5 22h14M5 22V11l7-5 7 5v11M10 22v-5h4v5" />
    </svg>
  ),
  urbano: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V7l5-4v18M14 21V11l5-3v13" />
    </svg>
  ),
}

const FORM_VACIO = {
  name: '', description: '', category: 'natural',
  location: '', googleMapsUrl: '', image: '',
  historicalContext: '', yearBuilt: '', entryPrice: '', website: '',
  coordinates: { lat: '', lng: '' },
}

export default function Admin() {
  const { token } = useAuth()

  const [sitios, setSitios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [panel, setPanel] = useState('lista')
  const [form, setForm] = useState(FORM_VACIO)
  const [formError, setFormError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [pulsoGuardar, setPulsoGuardar] = useState(false)
  const [exitoso, setExitoso] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [modalEliminar, setModalEliminar] = useState(null)
  const [formVisible, setFormVisible] = useState(false)

  // Animaciones
  usePageAnimations(panel)

  useEffect(() => {
    document.title = 'Admin · Patrimonio360°'
    cargarSitios()
  }, [])

  const cargarSitios = async () => {
    setCargando(true)
    setError('')
    try {
      const res = await fetch('http://localhost:3000/api/locations/all', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) setSitios(data.data)
      else setError('No se pudieron cargar los sitios.')
    } catch {
      setError('Error de conexión con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'lat' || name === 'lng') {
      setForm((p) => ({ ...p, coordinates: { ...p.coordinates, [name]: value } }))
    } else {
      setForm((p) => ({ ...p, [name]: value }))
    }
  }

  const abrirNuevo = () => {
    setForm(FORM_VACIO)
    setFormError('')
    setExitoso('')
    setEditandoId(null)
    setFormVisible(false)
    setPanel('nuevo')
    requestAnimationFrame(() => requestAnimationFrame(() => setFormVisible(true)))
  }

  const abrirEditar = (sitio) => {
    setForm({
      name: sitio.name,
      description: sitio.description,
      category: sitio.category,
      location: sitio.location,
      googleMapsUrl: sitio.googleMapsUrl,
      image: sitio.image || '',
      historicalContext: sitio.historicalContext || '',
      yearBuilt: sitio.yearBuilt || '',
      entryPrice: sitio.entryPrice || '',
      website: sitio.website || '',
      active: sitio.active,
      coordinates: { lat: sitio.coordinates.lat, lng: sitio.coordinates.lng },
    })
    setFormError('')
    setExitoso('')
    setEditandoId(sitio._id)
    setFormVisible(false)
    setPanel('editar')
    requestAnimationFrame(() => requestAnimationFrame(() => setFormVisible(true)))
  }

  const validarForm = () => {
    if (!form.name.trim()) return 'El nombre es obligatorio.'
    if (!form.description.trim()) return 'La descripción es obligatoria.'
    if (!form.location.trim()) return 'La ubicación es obligatoria.'
    if (!form.googleMapsUrl.trim()) return 'El enlace de Google Maps es obligatorio.'
    if (!form.coordinates.lat || !form.coordinates.lng) return 'Las coordenadas son obligatorias.'
    const lat = parseFloat(form.coordinates.lat)
    const lng = parseFloat(form.coordinates.lng)
    if (isNaN(lat) || lat < -90 || lat > 90) return 'Latitud inválida (entre -90 y 90).'
    if (isNaN(lng) || lng < -180 || lng > 180) return 'Longitud inválida (entre -180 y 180).'
    return ''
  }

  const handleGuardar = async () => {
    const err = validarForm()
    if (err) { setFormError(err); return }

    setGuardando(true)
    setFormError('')
    setExitoso('')

    const body = {
      ...form,
      coordinates: {
        lat: parseFloat(form.coordinates.lat),
        lng: parseFloat(form.coordinates.lng),
      },
    }

    const esEdicion = panel === 'editar'
    const url = esEdicion
      ? `http://localhost:3000/api/locations/${editandoId}`
      : 'http://localhost:3000/api/locations'
    const method = esEdicion ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        setExitoso(esEdicion ? 'Sitio actualizado correctamente.' : 'Sitio creado correctamente.')
        await cargarSitios()
        setTimeout(() => { setPanel('lista'); setExitoso('') }, 1200)
      } else {
        setFormError(data.message || 'Ocurrió un error al guardar.')
      }
    } catch {
      setFormError('Error de conexión con el servidor.')
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async () => {
    if (!modalEliminar) return
    try {
      const res = await fetch(`http://localhost:3000/api/locations/${modalEliminar.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) await cargarSitios()
    } catch {
      setError('Error al eliminar el sitio.')
    } finally {
      setModalEliminar(null)
    }
  }

  // ── Estadísticas rápidas para el header de la lista ──
  const totalActivos = sitios.filter(s => s.active).length
  const totalInactivos = sitios.filter(s => !s.active).length

  return (
    <div className="min-h-screen bg-gray-50 font-display flex flex-col">
      <Header />

      <div className="max-w-5xl mx-auto w-full px-6 py-10 flex-1">

        {/* ══════════════════════════════════════════════
        PANEL: LISTA
        ══════════════════════════════════════════════ */}
        {panel === 'lista' && (
          <>
            {/* Título + stats + botón */}
            <div className="flex items-start justify-between mb-8 pa-fade-down" data-pa-delay="0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sitios Culturales Turísticos </h1>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    {totalActivos} activos
                  </span>
                  {totalInactivos > 0 && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                      {totalInactivos} inactivos
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={abrirNuevo}
                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition shadow-sm"
              >
                <Icons.Plus />
                Agregar sitio
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            {/* Skeleton */}
            {cargando ? (
              <div className="space-y-3 pa-fade-up" data-pa-delay="1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-100 rounded w-1/4 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sitios.length === 0 ? (
              /* Estado vacío */
              <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Icons.Pin />
                </div>
                <p className="text-gray-500 text-sm font-medium">No hay sitios registrados aún</p>
                <button onClick={abrirNuevo} className="mt-3 text-sm font-semibold text-gray-900 underline underline-offset-2">
                  Agrega el primero
                </button>
              </div>
            ) : (
              /* Cards de sitios */
              <div className="space-y-3 pa-fade-up" data-pa-delay="1">
                {sitios.map((sitio) => (
                  <div
                    key={sitio._id}
                    className={`bg-white rounded-2xl border transition group ${sitio.active
                      ? 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                      : 'border-red-100 bg-red-50/30'
                      }`}
                  >
                    <div className="flex items-center gap-4 px-5 py-4">

                      {/* Ícono de categoría */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-gray-500 ${sitio.active ? 'bg-gray-100' : 'bg-red-100 text-red-400'
                        }`}>
                        {CATEGORIA_ICONS_SVG[sitio.category] || <Icons.Pin />}
                      </div>

                      {/* Info principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className={`font-semibold text-sm truncate ${sitio.active ? 'text-gray-900' : 'text-red-700'
                            }`}>
                            {sitio.name}
                          </p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0 ${CATEGORIA_COLORS[sitio.category] || 'bg-gray-100 text-gray-600'
                            }`}>
                            {sitio.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{sitio.location}</p>
                      </div>

                      {/* Estado */}
                      <div className="shrink-0 hidden sm:flex items-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sitio.active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-600'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sitio.active ? 'bg-emerald-400' : 'bg-red-400'
                            }`} />
                          {sitio.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => abrirEditar(sitio)}
                          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                          title="Editar"
                        >
                          <Icons.Edit />
                        </button>
                        <button
                          onClick={() => setModalEliminar({ id: sitio._id, name: sitio.name })}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar"
                        >
                          <Icons.Trash />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════
        PANEL: FORMULARIO
        ══════════════════════════════════════════════ */}
        {(panel === 'nuevo' || panel === 'editar') && (
          <div
            style={{
              opacity: formVisible ? 1 : 0,
              transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm mb-8 max-w-2xl mx-auto text-gray-400">
              <button onClick={() => setPanel('lista')} className="hover:text-gray-900 transition font-medium">
                Sitios
              </button>
              <Icons.ChevronRight />
              <span className="text-gray-900 font-medium">
                {panel === 'nuevo' ? 'Agregar sitio' : 'Editar sitio'}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto pa-fade-up" data-pa-delay="1">

              {/* Encabezado del formulario */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                  {panel === 'nuevo' ? <Icons.Plus /> : <Icons.Edit />}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    {panel === 'nuevo' ? 'Nuevo sitio turístico' : 'Editar sitio'}
                  </h1>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Los campos marcados con <span className="text-red-400">*</span> son obligatorios
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                {/* Sección: Información básica */}
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Información básica
                </p>

                {CAMPOS.slice(0, 5).map(({ key, label, placeholder, required, textarea }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {label}
                      {required
                        ? <span className="text-red-400 ml-1">*</span>
                        : <span className="text-gray-400 font-normal text-xs ml-2">opcional</span>
                      }
                    </label>
                    {textarea ? (
                      <textarea name={key} value={form[key]} onChange={handleChange}
                        placeholder={placeholder} rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition resize-none" />
                    ) : (
                      <input name={key} value={form[key]} onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition" />
                    )}
                  </div>
                ))}

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Categoría <span className="text-red-400">*</span>
                  </label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition capitalize">
                    {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Coordenadas */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Coordenadas <span className="text-red-400">*</span>
                    <span className="text-xs text-gray-400 font-normal ml-2">cópialas desde Google Maps</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input name="lat" value={form.coordinates.lat} onChange={handleChange}
                      placeholder="Latitud · ej: 11.3287"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition" />
                    <input name="lng" value={form.coordinates.lng} onChange={handleChange}
                      placeholder="Longitud · ej: -73.9644"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition" />
                  </div>
                </div>

                {/* Divisor */}
                <div className="pt-2 pb-1 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-4">
                    Información adicional
                  </p>
                </div>

                {/* Campos opcionales */}
                {CAMPOS.slice(5).map(({ key, label, placeholder, textarea }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {label}
                      <span className="text-gray-400 font-normal text-xs ml-2">opcional</span>
                    </label>
                    {textarea ? (
                      <textarea name={key} value={form[key]} onChange={handleChange}
                        placeholder={placeholder} rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition resize-none" />
                    ) : (
                      <input name={key} value={form[key]} onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition" />
                    )}
                  </div>
                ))}

                {/* Toggle activo — solo en edición */}
                {panel === 'editar' && (
                  <div className="flex items-center justify-between py-4 px-5 bg-gray-50 rounded-xl border border-gray-200 mt-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Sitio activo</p>
                      <p className="text-xs text-gray-400 mt-0.5">Los sitios inactivos no aparecen en el mapa</p>
                    </div>
                    <button type="button"
                      onClick={() => setForm((p) => ({ ...p, active: !p.active }))}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.active !== false ? 'bg-gray-900' : 'bg-gray-300'
                        }`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${form.active !== false ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                    </button>
                  </div>
                )}

                {/* Mensajes de error / éxito */}
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    {formError}
                  </div>
                )}
                {exitoso && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                    <Icons.Check />
                    {exitoso}
                  </div>
                )}

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setPulsoGuardar(true)
                      setTimeout(() => setPulsoGuardar(false), 400)
                      handleGuardar()
                    }}
                    disabled={guardando}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-black transition shadow-sm disabled:opacity-50"
                    style={pulsoGuardar ? { animation: 'btnPulse 0.4s cubic-bezier(0.22,1,0.36,1)' } : {}}
                  >
                    {guardando ? 'Guardando...' : panel === 'nuevo' ? 'Crear sitio' : 'Guardar cambios'}
                  </button>
                  <button onClick={() => setPanel('lista')}
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition">
                    Cancelar
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal eliminar ── */}
      {modalEliminar && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-[modalIn_0.3s_cubic-bezier(0.22,1,0.36,1)]">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-red-500">
              <Icons.Trash />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">¿Eliminar este sitio?</h3>
            <p className="text-sm text-gray-500 text-center mb-7 leading-relaxed">
              <span className="font-semibold text-gray-700">{modalEliminar.name}</span> será eliminado
              permanentemente y dejará de aparecer en el mapa.
            </p>
            <div className="flex gap-3">
              <button onClick={handleEliminar}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition">
                Sí, eliminar
              </button>
              <button onClick={() => setModalEliminar(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}