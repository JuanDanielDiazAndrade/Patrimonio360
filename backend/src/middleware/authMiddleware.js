const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No estás autenticado. Por favor inicia sesión.',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: 'El usuario de este token ya no existe.',
            });
        }

        req.user = currentUser;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado. Por favor inicia sesión nuevamente.',
        });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para realizar esta acción.',
            });
        }
        next();
    };
};

module.exports = { protect, restrictTo };