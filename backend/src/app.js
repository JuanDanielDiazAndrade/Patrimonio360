// Carga las variables del archivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');

// Conecta a MongoDB Atlas
connectDB();

const app = express();

// Permite que el frontend (otro puerto) se comunique con el backend
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Permite que el servidor lea datos JSON que envía el frontend
app.use(express.json());

// Rutas de autenticación: /api/auth/register, /api/auth/login
app.use('/api/auth', authRoutes);

// Rutas de sitios del mapa: /api/locations
app.use('/api/locations', locationRoutes);

// Ruta para verificar que el servidor está corriendo
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor Patrimonio360° funcionando 🇨🇴' });
});

// Si llaman a una ruta que no existe responde con 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada.' });
});

// Arranca el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});