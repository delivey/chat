const { Schema, model } = require("mongoose");

const messagesSchema = new Schema({
    isPrivate: { type: Boolean, default: false },
    receiver_id: { type: String, default: "all"},
    user_id: String,
    username: String,
    content: String
});

const Messages = model("messages", messagesSchema);

module.exports = { Messages };
