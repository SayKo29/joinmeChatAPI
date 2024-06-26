const Schema = require("../models/chatroom.schema");

exports.newChatroom = (req, res) => {

    //
    const newData = Schema({
        name: req.body.name,
    });



    newData
        .save(newData)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while creating the new chatroom.",
            });
        });
};

exports.getChatrooms = (req, res) => {
    Schema.find()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Some error occurred while retrieving chatrooms.",
            });
        });
};

exports.findById = (req, res) => {
    const id = req.params.id;

    Schema.findById(id)
        .then((data) => {
            if (!data)
                res.status(404).send({
                    message: "Not found chatroom with id " + id,
                });
            else res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error retrieving chatroom with id=" + id,
            });
        });
};

exports.updateChatroom = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!",
        });
    }

    const id = req.params.id;

    Schema.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update chatroom with id=${id}. Maybe chatroom was not found!`,
                });
            } else res.send({ message: "Chatroom was updated successfully." });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating chatroom with id=" + id,
            });
        });
};

exports.deleteChatroom = (req, res) => {
    const id = req.params.id;

    Schema.findByIdAndRemove(id)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete chatroom with id=${id}. Maybe chatroom was not found!`,
                });
            } else {
                res.send({
                    message: "Chatroom was deleted successfully!",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete chatroom with id=" + id,
            });
        });
};

exports.handleJoinRoom = (socket, data) => {
    const { chatroomId } = data;
    socket.join(chatroomId);
};

exports.handleLeaveRoom = (socket, data) => {
    const { chatroomId } = data;
    socket.leave(chatroomId);
};

exports.handleChatroomMessage = async (socket, data) => {

    const { chatroomId, message } = data;
    const newMessage = new Message({
        chatroom: chatroomId,
        sender: socket.user._id,
        message,
    });
    await newMessage.save();
    socket.to(chatroomId).emit("chatroomMessage", newMessage);
};
