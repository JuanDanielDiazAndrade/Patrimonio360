const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'La descripción es obligatoria'],
            trim: true,
        },
        category: {
            type: String,
            enum: ['natural', 'cultural', 'histórico', 'arqueológico', 'religioso', 'urbano'],
            default: 'natural',
        },
        image: {
            type: String,
            default: '',
        },

        // Información histórica y cultural (opcional)
        historicalContext: {
            type: String,
            default: '',
            trim: true,
        },

        // Año o período de construcción — ej: "1969", "Siglo XVI", "200 a.C."
        yearBuilt: {
            type: String,
            default: '',
            trim: true,
        },

        // Precio de entrada — ej: "Gratuito", "$22.000 COP", "Desde $15 USD"
        entryPrice: {
            type: String,
            default: '',
            trim: true,
        },

        // Página web oficial
        website: {
            type: String,
            default: '',
            trim: true,
        },

        // Texto legible para la UI — ej: "Magdalena - Santa Marta, km 20 Troncal del Caribe"
        location: {
            type: String,
            required: [true, 'La ubicación es obligatoria'],
            trim: true,
        },

        // Solo para posicionar el marcador en el mapa — no se muestra en la UI
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },

        // Link directo a Google Maps con fotos, reseñas, etc.
        googleMapsUrl: {
            type: String,
            required: [true, 'El enlace de Google Maps es obligatorio'],
            trim: true,
        },

        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Location', locationSchema);