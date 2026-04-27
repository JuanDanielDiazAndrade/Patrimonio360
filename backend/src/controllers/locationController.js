const Location = require('../models/Location');

// Obtener todos los sitios
const getLocations = async (req, res) => {
    try {
        const locations = await Location.find({ activo: true });
        res.status(200).json({ success: true, data: locations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener sitios.' });
    }
};

// Obtener un sitio por ID
const getLocation = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ success: false, message: 'Sitio no encontrado.' });
        }
        res.status(200).json({ success: true, data: location });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el sitio.' });
    }
};

// Crear un sitio (solo admin)
const createLocation = async (req, res) => {
    try {
        const location = await Location.create(req.body);
        res.status(201).json({ success: true, data: location });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear el sitio.' });
    }
};

// Actualizar un sitio (solo admin)
const updateLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!location) {
            return res.status(404).json({ success: false, message: 'Sitio no encontrado.' });
        }
        res.status(200).json({ success: true, data: location });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el sitio.' });
    }
};

// Eliminar un sitio (solo admin)
const deleteLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) {
            return res.status(404).json({ success: false, message: 'Sitio no encontrado.' });
        }
        res.status(200).json({ success: true, message: 'Sitio eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el sitio.' });
    }
};

module.exports = { getLocations, getLocation, createLocation, updateLocation, deleteLocation };