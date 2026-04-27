const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
    body('email')
        .trim()
        .notEmpty().withMessage('El correo es obligatorio.')
        .isEmail().withMessage('Ingresa un correo electrónico válido.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
        .withMessage('La contraseña debe incluir al menos 1 mayúscula, 1 número y 1 carácter especial.'),
    body('confirmPassword')
        .notEmpty().withMessage('Debes confirmar la contraseña.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden.');
            }
            return true;
        }),
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('El correo es obligatorio.')
        .isEmail().withMessage('Ingresa un correo electrónico válido.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.'),
];

router.post('/register', registerValidation, register);
router.post('/login',    loginValidation,    login);
router.get('/me',        protect,            getMe);

module.exports = router;