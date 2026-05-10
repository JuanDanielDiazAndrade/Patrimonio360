// Configuración de Tailwind CSS.
// Define los archivos que Tailwind debe escanear para generar solo el CSS que realmente se usa (content), y extiende el tema con colores, fuentes y radios de borde propios del proyecto.
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#000000',
                'background-light': '#f8f6f6',
                'background-dark': '#221610',
            },
            fontFamily: {
                display: ['Public Sans', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                lg: '0.5rem',
                xl: '0.75rem',
                full: '9999px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}