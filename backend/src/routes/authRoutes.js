const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validaciones del registro (segunda capa de seguridad después del frontend)
const registerValidation = [
    body('name').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('email').trim().isEmail().withMessage('Correo inválido.').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres.'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Las contraseñas no coinciden.');
        return true;
    }),
];

// Validaciones básicas del login
const loginValidation = [
    body('email').trim().isEmail().withMessage('Correo inválido.').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es obligatoria.'),
];

// Rutas públicas
router.post('/register', registerValidation, register);
router.post('/login',    loginValidation,    login);

// Ruta protegida — requiere token válido
router.get('/me', protect, getMe);

module.exports = router;