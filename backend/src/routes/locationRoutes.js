const express = require('express');
const {
    getLocations,
    getLocation,
    createLocation,
    updateLocation,
    deleteLocation,
} = require('../controllers/locationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas públicas — cualquiera puede ver los sitios
router.get('/',    getLocations);
router.get('/:id', getLocation);

// Rutas protegidas — solo admins pueden crear, editar y eliminar
router.post('/',       protect, restrictTo('admin'), createLocation);
router.put('/:id',     protect, restrictTo('admin'), updateLocation);
router.delete('/:id',  protect, restrictTo('admin'), deleteLocation);

module.exports = router;