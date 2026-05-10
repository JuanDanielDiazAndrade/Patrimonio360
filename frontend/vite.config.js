// Configuración de Vite, el bundler y servidor de desarrollo.
// Registra el plugin de React para que Vite pueda procesar archivos JSX y manejar el hot-reload automático.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
})