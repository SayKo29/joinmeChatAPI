// get chatroomMessages from the mongoDB

const Chatroom = require("../models/chatroom.schema");
const Message = require("../models/message.schema");

const getChatroomMessages = async (chatroomId) => {
    try {
        const messages = await Message.find({ chatroom: chatroomId })
            .sort({ createdAt: -1 })
            .populate({ path: "user", select: "name" });
        return messages;
    } catch (error) {
        console.log(error);
    }
};

const sendChatroomMessage = async (data) => {
    try {
        const message = new Message({
            user: data.user.id,
            chatroom: data.chatroom,
            message: data.message,
        });
        await message.save();
        let newMessage = await Message.findById(message._id).populate({
            path: "user",
            select: "name",
        });
        return newMessage;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getChatroomMessages,
    sendChatroomMessage,
};
