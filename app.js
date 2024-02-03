const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    transports: ["websocket", "polling"],
    reconnectionDelay: 1000, // 1 segundo
    reconnectionAttempts: 10, // Número máximo de intentos
});
require("dotenv").config();
require("./config/mongodb.config").sync;

// Importar modelos
require("./models/user.schema");
require("./models/chatroom.schema");
require("./models/message.schema");

// Importar controladores
const userChat = require("./controllers/userchat.controller");
const chatController = require("./controllers/chat.controller");

// Importar servicios
const messageService = require("./services/message.service");

// Manejar eventos de socket con controladores
io.on("connect", userChat.handleConnection);
io.on("disconnect", userChat.handleDisconnection);
io.on("reconnect", userChat.handleReconnection);
io.on("joinRoom", chatController.handleJoinRoom);
io.on("leaveRoom", chatController.handleLeaveRoom);
io.on("chatroomMessage", chatController.handleChatroomMessage);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
});
