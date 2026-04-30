require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');

connectDB();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor Patrimonio360° funcionando correctamente 🇨🇴' });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: `Ruta ${req.originalUrl} no encontrada.` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});