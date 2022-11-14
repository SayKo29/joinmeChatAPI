const express = require("express");
const router = express.Router();

// sign up new user
router.post("/register", require("../controllers/user.controller.js").newUser);
// sign in (user authentication)
router.post("/login", require("../controllers/auth.controller.js").signIn);
// verify token (user authorization)
router.get(
    "/verify",
    require("../controllers/auth.controller").verifyAccessToken
);
// read all user data
router.get("/users", require("../controllers/user.controller.js").find);
// read user data by id
router.get("/users/:id", require("../controllers/user.controller.js").findById);
// update user data by id
router.put(
    "/users/:id",
    require("../controllers/user.controller.js").findOneAndUpdate
);
// delete user data by id
router.delete(
    "/users/:id",
    require("../controllers/user.controller.js").findByIdAndRemove
);
// delete all user data
// router.delete('/users', require('../controllers/user.controller.js').remove);

// event routes

// create new event
router.post("/events", require("../controllers/event.controller.js").newEvent);
// read all event data
router.get("/events", require("../controllers/event.controller.js").find);
// read event data by id
router.get(
    "/events/:id",
    require("../controllers/event.controller.js").findById
);
// update event data by id
router.put(
    "/events/:id",
    require("../controllers/event.controller.js").findOneAndUpdate
);
// delete event data by id
router.delete(
    "/events/:id",
    require("../controllers/event.controller.js").findByIdAndRemove
);

// find by participant
router.get(
    "/events/participant/:id",
    require("../controllers/event.controller.js").findByParticipant
);

// category routes

// create new category
router.post(
    "/categories",
    require("../controllers/category.controller.js").newEvent
);
// read all category data
router.get(
    "/categories",
    require("../controllers/category.controller.js").find
);
// read category data by id
router.get(
    "/categories/:id",
    require("../controllers/category.controller.js").findById
);
// update category data by id
router.put(
    "/categories/:id",
    require("../controllers/category.controller.js").findOneAndUpdate
);
// delete category data by id
router.delete(
    "/categories/:id",
    require("../controllers/category.controller.js").findByIdAndRemove
);

// chatroom routes

// get chatroom by id
router.get(
    "/chatrooms/:id",
    require("../controllers/chatroom.controller.js").findById
);

// message routes

// create new message
router.post(
    "/messages",
    require("../controllers/message.controller.js").newMessage
);
// read all message data
router.get(
    "/messages",
    require("../controllers/message.controller.js").getMessages
);


module.exports = router;
