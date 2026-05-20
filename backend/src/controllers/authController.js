const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// REGISTRO
const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Este correo ya está registrado.' });
        }

        const newUser = await User.create({ name, email, password });
        const token = generateToken(newUser._id);

        res.status(201).json({
            success: true,
            message: 'Cuenta creada',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos.' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Bienvenido',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

// PERFIL
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error del servidor.' });
    }
};

module.exports = { register, login, getMe };