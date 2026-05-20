const express = require('express');
const {
    getLocations,
    getLocation,
    createLocation,
    updateLocation,
    deleteLocation,
    getAllLocations,
} = require('../controllers/locationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta pública — cualquiera puede ver el sitio
router.get('/', getLocations);

// Ruta protegida — solo admins pueden ver todos los sitios
router.get('/all', protect, restrictTo('admin'), getAllLocations);

// Ruta pública — cualquiera puede ver el sitio
router.get('/:id', getLocation);

// Rutas protegidas — solo admins pueden crear, editar y eliminar
router.post('/', protect, restrictTo('admin'), createLocation);
router.put('/:id', protect, restrictTo('admin'), updateLocation);
router.delete('/:id', protect, restrictTo('admin'), deleteLocation);

module.exports = router;