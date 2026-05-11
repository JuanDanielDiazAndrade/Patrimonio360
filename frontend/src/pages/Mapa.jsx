import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function Mapa() {
    // Referencia al div donde Mapbox dibuja el mapa
    const mapContainer = useRef(null);

    // Referencia a la instancia del mapa para controlarlo desde cualquier función
    const map = useRef(null);

    // Sitio seleccionado al hacer click en un marcador — null = panel cerrado
    const [sitioSeleccionado, setSitioSeleccionado] = useState(null);

    // Controla si el mapa está en vista normal o satelital
    const [esSatelital, setEsSatelital] = useState(false);

    // Se ejecuta una sola vez al cargar la página — inicializa el mapa
    useEffect(() => {
        if (map.current) return; // evita crear el mapa dos veces

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/standard', // estilo con edificios 3D
            center: [-74.2973, 4.5709],               // Colombia
            zoom: 5.5,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        map.current.addControl(new mapboxgl.FullscreenControl());

        // Cuando el mapa termina de cargar completamente
        map.current.on('load', () => {
            map.current.setConfigProperty('basemap', 'lightPreset', 'day'); // iluminación de día
            map.current.easeTo({ pitch: 45, bearing: -17.6, duration: 1000 }); // inclinación 3D
            cargarSitios(); // carga los sitios desde el backend
        });
    }, []);

    // Alterna entre vista normal 3D y vista satelital plana
    const cambiarEstilo = () => {
        if (esSatelital) {
            map.current.setStyle('mapbox://styles/mapbox/standard');
            map.current.easeTo({ pitch: 45, bearing: -17.6, duration: 1000 });
        } else {
            map.current.setStyle('mapbox://styles/mapbox/satellite-streets-v12');
            map.current.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
        }
        setEsSatelital(!esSatelital);
    };

    // Llama al backend y obtiene los sitios turísticos de MongoDB
    const cargarSitios = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/locations');
            const data = await response.json();
            if (data.success && data.data.length > 0) {
                agregarMarcadores(data.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Coloca un marcador en el mapa por cada sitio turístico
    const agregarMarcadores = (sitios) => {
        sitios.forEach(sitio => {
            // Crea el punto negro del marcador
            const el = document.createElement('div');
            el.style.cssText = 'width:20px;height:20px;background:black;border:3px solid white;border-radius:50%;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.4);';

            // Coloca el marcador en las coordenadas del sitio
            new mapboxgl.Marker(el)
                .setLngLat([sitio.coordenadas.lng, sitio.coordenadas.lat])
                .addTo(map.current);

            // Al hacer click: abre el panel lateral y vuela hacia el sitio
            el.addEventListener('click', () => {
                setSitioSeleccionado(sitio);
                map.current.flyTo({
                    center: [sitio.coordenadas.lng, sitio.coordenadas.lat],
                    zoom: 10,
                    duration: 1500,
                });
            });
        });
    };

    return (
        <div className="relative w-full h-screen">

            <header className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <a href="/">
                    <img src="/images/large_logo.png" alt="Patrimonio360°" className="h-8 w-auto" />
                </a>
                <a href="/" className="text-sm font-medium text-gray-600 hover:text-black transition">
                    ← Volver
                </a>
            </header>

            {/* Contenedor del mapa — Mapbox dibuja aquí */}
            <div ref={mapContainer} className="w-full h-full" />

            {/* Botón flotante para cambiar entre vista normal y satelital */}
            <button
                onClick={cambiarEstilo}
                className="absolute top-20 left-4 z-10 flex items-center gap-2 bg-white border border-gray-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-md"
            >
                {esSatelital ? 'Vista Normal' : 'Vista Satelital'}
            </button>

            {/* Panel lateral — solo aparece cuando el usuario hace click en un marcador */}
            {sitioSeleccionado && (
                <div className="absolute top-0 right-0 h-full w-96 bg-white shadow-2xl z-20 overflow-y-auto">

                    {/* Botón cerrar — vuelve sitioSeleccionado a null y oculta el panel */}
                    <button
                        onClick={() => setSitioSeleccionado(null)}
                        className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition z-10"
                    >
                        ✕
                    </button>

                    <div className="w-full h-56 bg-gray-200 overflow-hidden">
                        <img
                            src={sitioSeleccionado.imagen || '/images/tayrona.jpg'}
                            alt={sitioSeleccionado.nombre}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-6">
                        <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-black text-white px-3 py-1 rounded-full mb-4">
                            {sitioSeleccionado.categoria}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            {sitioSeleccionado.nombre}
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            {sitioSeleccionado.descripcion}
                        </p>
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Ubicación
                            </p>
                            <p className="text-sm text-gray-700 font-mono">
                                Lat: {sitioSeleccionado.coordenadas.lat}, Lng: {sitioSeleccionado.coordenadas.lng}
                            </p>
                        </div>

                        {/* Enlace a Google Maps con las coordenadas del sitio */}
                        <a
                            href={`https://www.google.com/maps?q=${sitioSeleccionado.coordenadas.lat},${sitioSeleccionado.coordenadas.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-black text-white text-center py-3 rounded-xl font-medium hover:bg-gray-800 transition block"
                        >
                            Ver en Google Maps
                        </a>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Mapa;