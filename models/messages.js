const { Schema, model } = require("mongoose");

const messagesSchema = new Schema({
    username: String,
    content: String
});

const Messages = model("messages", messagesSchema);

module.exports = { Messages };
