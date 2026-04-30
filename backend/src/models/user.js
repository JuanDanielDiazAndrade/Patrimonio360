const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        // Nombre del usuario
        name: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
        },
        // Correo único, siempre en minúsculas
        email: {
            type: String,
            required: [true, 'El correo es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        // Contraseña hasheada, nunca se devuelve en consultas
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [8, 'Mínimo 8 caracteres'],
            select: false,
        },
        // Rol del usuario: 'user' normal o 'admin'
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true, // agrega createdAt y updatedAt automáticamente
    }
);

// Antes de guardar, hashea la contraseña automáticamente
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Método para comparar contraseña en el login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;