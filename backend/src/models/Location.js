const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
        },
        descripcion: {
            type: String,
            required: [true, 'La descripción es obligatoria'],
        },
        categoria: {
            type: String,
            enum: ['arqueologico', 'colonial', 'natural', 'cultural', 'religioso'],
            default: 'cultural',
        },
        imagen: {
            type: String,
            default: '',
        },
        coordenadas: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        activo: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Location', locationSchema);