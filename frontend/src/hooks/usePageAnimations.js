// usePageAnimations.js
// Animaciones de entrada para Login.jsx, Register.jsx, Map.jsx y Admin.jsx (POR AHORA).
// Aplica un stagger de aparición (fade + slide) a los elementos marcados
// con las clases utilitarias definidas abajo.
//
// Clases disponibles para marcar elementos en el JSX:
//
//   .pa-fade-up      → entra desde abajo  (más común: cards, formularios)
//   .pa-fade-down    → entra desde arriba (headers, breadcrumbs)
//   .pa-fade-left    → entra desde la derecha
//   .pa-fade-right   → entra desde la izquierda
//   .pa-scale-in     → aparece creciendo  (modales, paneles)
//
// Uso básico:
//   1. Llama `usePageAnimations()` dentro del componente.
//   2. Añade la clase correspondiente al elemento en el JSX.
//   3. Si quieres controlar el orden de aparición usa:
//        data-pa-delay="0"   → inmediato
//        data-pa-delay="1"   → 80 ms
//        data-pa-delay="2"   → 160 ms  … etc.
//      (sin data-pa-delay el orden lo define el DOM)

import { useEffect } from 'react'

// Duración base de cada step de stagger (ms)
const STAGGER_STEP = 80

// Mapa de clases → transform inicial
const VARIANTS = {
    'pa-fade-up': 'translateY(24px)',
    'pa-fade-down': 'translateY(-24px)',
    'pa-fade-left': 'translateX(24px)',
    'pa-fade-right': 'translateX(-24px)',
    'pa-scale-in': 'scale(0.94)',
}

export default function usePageAnimations(dep) {
    useEffect(() => {
        // Selecciona todos los elementos con alguna clase de animación
        const selector = Object.keys(VARIANTS).map((c) => `.${c}`).join(', ')
        const elementos = Array.from(document.querySelectorAll(selector))

        if (elementos.length === 0) return

        // Estado inicial: invisible + transformado
        elementos.forEach((el) => {
            el.style.opacity = '0'
            el.style.transform = getInitialTransform(el)
            el.style.transition = 'none'
        })

        // Ordena por data-pa-delay si existe; si no, por posición en el DOM
        const ordenados = [...elementos].sort((a, b) => {
            const da = parseInt(a.dataset.paDelay ?? '-1', 10)
            const db = parseInt(b.dataset.paDelay ?? '-1', 10)
            // Elementos sin atributo mantienen orden del DOM
            if (da === -1 && db === -1) return 0
            if (da === -1) return 1
            if (db === -1) return -1
            return da - db
        })

        // Un frame de gracia para que el navegador aplique el estado inicial
        // antes de arrancar las transiciones
        const rafId = requestAnimationFrame(() => {
            ordenados.forEach((el, i) => {
                const delay =
                    el.dataset.paDelay !== undefined
                        ? parseInt(el.dataset.paDelay, 10) * STAGGER_STEP
                        : i * STAGGER_STEP

                setTimeout(() => {
                    el.style.transition = 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)'
                    el.style.opacity = '1'
                    el.style.transform = 'none'
                }, delay)
            })
        })

        return () => {
            cancelAnimationFrame(rafId)
            // Limpia estilos inline al desmontar para no interferir
            // si el componente se reutiliza en la misma sesión
            elementos.forEach((el) => {
                el.style.opacity = ''
                el.style.transform = ''
                el.style.transition = ''
            })
        }
    }, [dep])
}

// Devuelve el transform inicial según la clase que tenga el elemento
function getInitialTransform(el) {
    for (const [cls, transform] of Object.entries(VARIANTS)) {
        if (el.classList.contains(cls)) return transform
    }
    return 'none'
}