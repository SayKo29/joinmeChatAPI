const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name: {
            type: String,
            default: null,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: true,
        },
        gender: {
            type: String,
            default: null,
            required: true,
        },
        password: {
            type: String,
            default: null,
            required: true,
        },
        avatar: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ["member", "admin"],
            required: true,
        },
        events: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);
