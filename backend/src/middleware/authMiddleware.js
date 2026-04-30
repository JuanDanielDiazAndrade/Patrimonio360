const jwt = require('jsonwebtoken');
const User = require('../models/user');

// PROTECT - Verifica que el usuario esté logueado antes de entrar a una ruta protegida
// Se usa en las rutas así: router.get('/me', protect, getMe)
const protect = async (req, res, next) => {
    try {
        // Extrae el token del header Authorization: "Bearer <token>"
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Si no hay token, el usuario no está logueado
        if (!token) {
            return res.status(401).json({ success: false, message: 'No estás autenticado.' });
        }

        // Verifica que el token sea válido y extrae el ID del usuario
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Busca el usuario en MongoDB con ese ID
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ success: false, message: 'El usuario no existe.' });
        }

        // Adjunta el usuario a la petición para que el controlador lo pueda usar
        req.user = currentUser;

        // Pasa al siguiente paso (el controlador)
        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
    }
};

// RESTRICTTO - Verifica que el usuario tenga el rol necesario (por ejemplo 'admin')
// Se usa en las rutas así: router.post('/', protect, restrictTo('admin'), createLocation)
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'No tienes permiso.' });
        }
        next();
    };
};

module.exports = { protect, restrictTo };