const { Schema, model } = require("mongoose");

const usersSchema = new Schema({
    id: String,
    username: String, // String is shorthand for {type: String}
    friends: { type: Array, default: [] },
    sentMessages: { type: Array, default: [] },
});

const Users = model("users", usersSchema);

module.exports = { Users };
