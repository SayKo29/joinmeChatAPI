const socketioJwt = require("socketio-jwt");
const User = require("../models/user.schema");

// Middleware de autenticación para Socket.io
const authMiddleware = socketioJwt.authorize({
    secret: "mi_secreto", // Cambiar por tu propia clave secreta
    handshake: true,
});

// Middleware para verificar la autenticación y obtener el usuario
const getUserMiddleware = async (socket, next) => {
    try {
        const userId = socket.decoded_token.sub;
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        socket.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authMiddleware,
    getUserMiddleware,
};
