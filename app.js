const express = require("express");
const socket = require("socket.io");


// App setup
const PORT = 5000;
const app = express();


const Message = require("./models/message.schema");
const User = require("./models/user.schema");


const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
const io = socket(server);



// get user connected by id

io.use(async (socket, next) => {
    try {
        const { userId } = socket.handshake.query;
        const user = await User.findById(userId);
        if (!user) {
            return next(new Error("User not found"));
        }
        socket.userId = user;
        next();
    } catch (err) {}
});

io.on("connection", (socket) => {
    console.log("Connected: " + socket.userId);

    socket.on("disconnect", () => {
        console.log("Disconnected: " + socket.userId);
    });

    // join a room and send all messages in that room and populate user info message.user
    socket.on("joinRoom", async ({ chatroomId }) => {
        socket.join(chatroomId);
        try {
            const messages = await Message.find({ chatroom: chatroomId })
                .populate("user", "name")
                .sort({ createdAt: "asc" })
                .limit(100);
            socket.emit("allMessages", messages.reverse());
        } catch (err) {
            console.log(err);
        }

    });

    socket.on("leaveRoom", ({ chatroomId }) => {
        socket.leave(chatroomId);
        console.log("A user left chatroom: " + chatroomId);
    });

    //   recieve message from client and send to all users in chatroom
    socket.on("chatroomMessage", async ({ msg, chatroomId }) => {
        try {
            const user = await User.findById(socket.userId);
            const newMessage = new Message({
                user: user,
                message: msg,
                chatroom: chatroomId,
            });
            io.to(chatroomId).emit("newMessage", {
                message: msg,
                _id: newMessage._id,
                user: user,
            });
            await newMessage.save();
        } catch (err) {
            console.log(err);
        }
    });
});

//Setup Error Handlers
const errorHandlers = require("./handlers/errorHandlers");
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if (process.env.ENV === "DEVELOPMENT") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}


module.exports = app;