const UserSchema = require("../models/user.schema");
const ChatSchema = require("../models/chatroom.schema");
const MessageSchema = require("../models/message.schema");

const {
    getChatroomMessages,
    sendChatroomMessage,
} = require("../services/chatroom.service");

const handleConnection = (socket) => {

    socket.on("joinRoom", (chatRoomId) => {

        socket.join(chatRoomId);
    });

    socket.on("leaveRoom", (chatRoomId) => {

        socket.leave(chatRoomId);
    });

    socket.on("chatroomMessage", async (data) => {

        const message = await sendChatroomMessage(data);
        socket.to(data.chatroom).emit("newMessage", message);
    });

    socket.on("reconnect", async (chatRoomId) => {
        const messages = await getChatroomMessages(chatRoomId);
        socket.emit("allMessages", messages);
    });

    socket.on("getAllMessages", async (chatRoomId) => {
        const messages = await getChatroomMessages(chatRoomId);
        socket.emit("allMessages", messages);
    });
};

const handleDisconnection = (socket) => {
    socket.on("disconnect", () => {

    });
};

const handleReconnection = (socket) => {

};

module.exports = {
    handleConnection,
    handleDisconnection,
    handleReconnection,
};
