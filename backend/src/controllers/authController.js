const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');

// Crea un token de sesión con el ID del usuario
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// REGISTRO - Crea un usuario nuevo
const register = async (req, res) => {
    try {
        // Si hay errores de validación (campos vacíos, correo mal escrito, etc.) los devuelve
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // Verifica que el correo no esté registrado ya
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Este correo ya está registrado.' });
        }

        // Crea el usuario en MongoDB (la contraseña se hashea automáticamente en User.js)
        const newUser = await User.create({ name, email, password });

        // Genera el token de sesión
        const token = generateToken(newUser._id);

        // Responde con el token y los datos básicos del usuario
        res.status(201).json({
            success: true,
            message: 'Cuenta creada',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// LOGIN - Inicia sesión con correo y contraseña
const login = async (req, res) => {
    try {
        // Si hay errores de validación los devuelve
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        // Busca el usuario por correo (incluye la contraseña que normalmente está oculta)
        const user = await User.findOne({ email }).select('+password');

        // Si no existe el usuario o la contraseña es incorrecta, responde con error
        // Se juntan los dos checks para no dar pistas de cuál falló
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos.' });
        }

        // Genera el token de sesión
        const token = generateToken(user._id);

        // Responde con el token y los datos básicos del usuario
        res.status(200).json({
            success: true,
            message: 'Bienvenido',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// PERFIL - Devuelve los datos del usuario que está logueado
const getMe = async (req, res) => {
    try {
        // req.user.id viene del middleware authMiddleware.js que verificó el token
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

module.exports = { register, login, getMe };