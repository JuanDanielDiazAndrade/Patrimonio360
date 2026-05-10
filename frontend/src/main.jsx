// Punto de entrada de React.
// Monta la aplicación en el div#root del index.html.
// Envuelve todo en BrowserRouter para habilitar la navegación entre rutas sin recargar la página (React Router).
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
)