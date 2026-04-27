const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const formatValidationErrors = (errors) => {
    return errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
    }));
};

const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors),
            });
        }

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Este correo electrónico ya está registrado.',
            });
        }

        const newUser = await User.create({ name, email, password });
        const token = generateToken(newUser._id);

        res.status(201).json({
            success: true,
            message: '¡Cuenta creada exitosamente!',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt,
            },
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor. Inténtalo de nuevo.',
        });
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors),
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Correo o contraseña incorrectos.',
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: '¡Bienvenido de vuelta!',
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
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor. Inténtalo de nuevo.',
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

module.exports = { register, login, getMe };