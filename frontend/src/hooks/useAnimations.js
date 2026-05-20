// useAnimations.js
// Animaciones exclusivas de Home.jsx (POR AHORA):
//   · Scroll reveal para secciones, cards y features
//   · Hover de escala en imágenes (solo Home)
//   · Hover de escala en botones <button>

import { useEffect } from 'react'

export default function useAnimations() {
    useEffect(() => {
        // ── Scroll reveal ──────────────────────────────────────
        const elementos = document.querySelectorAll(
            'section, .highlight-card, .feature-item, .testimonial-card'
        )
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animado')
                    }
                })
            },
            { threshold: 0.15 }
        )
        elementos.forEach((el) => {
            el.classList.add('oculto')
            observer.observe(el)
        })

        // ── Hover en botones <button> ───────────────────────────────
        const handleEnterBtn = (e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.transition = 'transform 0.2s ease'
        }
        const handleLeaveBtn = (e) => {
            e.currentTarget.style.transform = 'scale(1)'
        }
        const botones = document.querySelectorAll('main button, footer button')
        botones.forEach((btn) => {
            btn.addEventListener('mouseenter', handleEnterBtn)
            btn.addEventListener('mouseleave', handleLeaveBtn)
        })

        // ── Hover en imágenes (exclusivo de Home) ──────────────
        const handleEnterImg = (e) => {
            e.currentTarget.style.transform = 'scale(1.03)'
            e.currentTarget.style.transition = 'transform 0.4s ease'
        }
        const handleLeaveImg = (e) => {
            e.currentTarget.style.transform = 'scale(1)'
        }
        const imagenes = document.querySelectorAll('main img')
        imagenes.forEach((img) => {
            img.addEventListener('mouseenter', handleEnterImg)
            img.addEventListener('mouseleave', handleLeaveImg)
        })

        return () => {
            observer.disconnect()
            botones.forEach((btn) => {
                btn.removeEventListener('mouseenter', handleEnterBtn)
                btn.removeEventListener('mouseleave', handleLeaveBtn)
            })
            imagenes.forEach((img) => {
                img.removeEventListener('mouseenter', handleEnterImg)
                img.removeEventListener('mouseleave', handleLeaveImg)
            })
        }
    }, [])
}