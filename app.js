const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    transports: ["websocket", "polling"],
    reconnectionDelay: 1000, // 1 segundo
    reconnectionAttempts: 10, // Número máximo de intentos
});
const mongoose = require("mongoose");
require("dotenv").config();
require("./config/mongodb.config").sync;

// Importar modelos
require("./models/user.schema");
require("./models/chatroom.schema");
require("./models/message.schema");

const Message = mongoose.model("message");
const User = mongoose.model("User");

// Middleware para manejar la autenticación del usuario
io.use(async (socket, next) => {
    try {
        const { userId } = socket.handshake.query;
        const user = await User.findById(userId);
        if (!user) {
            return next(new Error("User not found"));
        }
        socket.userId = user;
        next();
    } catch (err) {
        console.error(err);
        next(new Error("Authentication error"));
    }
});

// Evento de conexión
io.on("connection", async (socket) => {
    console.log("Connected: " + socket.userId.name);

    // Evento de desconexión
    socket.on("disconnect", () => {
        console.log("Disconnected: " + socket.userId.name);
    });

    // Evento de reconexión
    socket.on("reconnect", async () => {
        console.log("Reconnected: " + socket.userId.name);
        // Puedes agregar lógica aquí para restaurar el estado del usuario al reconectar.
    });

    // Evento para unirse a una sala
    socket.on("joinRoom", async ({ chatroomId }) => {
        console.log("A user joined chatroom: " + chatroomId);
        socket.join(chatroomId);
        try {
            // Obtener y enviar todos los mensajes en esa sala al unirse
            const messages = await Message.find({ chatroom: chatroomId })
                .populate("user", "name")
                .sort({ createdAt: "asc" })
                .limit(100);
            console.log(messages, "messages");
            // socket.emit("allMessages", messages.reverse());
            // emit to the user only
            socket.emit("allMessages", messages.reverse());
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("getAllMessages", async ({ chatroomId }) => {
        try {
            // Obtener y enviar todos los mensajes en esa sala al unirse
            const messages = await Message.find({ chatroom: chatroomId })
                .populate("user", "name")
                .sort({ createdAt: "asc" })
                .limit(100);
            console.log(messages, "messages");
            // socket.emit("allMessages", messages.reverse());
            // emit to the user only
            socket.emit("allMessages", messages.reverse());
        } catch (err) {
            console.error(err);
        }
    });

    // Evento para salir de una sala
    socket.on("leaveRoom", ({ chatroomId }) => {
        socket.leave(chatroomId);
        console.log("A user left chatroom: " + chatroomId);
    });

    // Evento para recibir mensajes del cliente y enviar a todos los usuarios en la sala
    socket.on("chatroomMessage", async ({ msg, chatroomId }) => {
        try {
            const user = await User.findById(socket.userId);
            if (!user) {
                throw new Error("User not found");
            }

            const newMessage = new Message({
                user: user,
                message: msg,
                chatroom: chatroomId,
            });

            await newMessage.save();

            io.to(chatroomId).emit("newMessage", {
                _id: newMessage._id,
                user: user,
                message: newMessage.message, // Ensure you are sending the actual message
                createdAt: newMessage.createdAt,
            });
        } catch (err) {
            console.error(err);
            socket.emit("chatroomMessageError", { error: err.message });
        }
    });
});

// Evento de reconexión general para el servidor
io.on("reconnect", (socket) => {
    console.log("Reconnected to server");
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
});
