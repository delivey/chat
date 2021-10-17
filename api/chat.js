const { Messages } = require("../models/messages.js")
const { Users } = require("../models/users.js")
log = console.log

module.exports = function (app, io) {
    app.get("/chat", async function (req, res) {
        const user_id = req.session.user_id
        if (!user_id) res.redirect("/");
        else {
            const ownUser = await Users.findOne({ id: user_id })
            const username = ownUser.username
            const messageList = await Messages.find().sort({ field: "asc", _id: -1 }).limit(7)
            const messages = JSON.stringify(messageList.reverse())
            res.render("chat", { ownUsername: username, ownUserId: user_id, onLoadedMessages: messages });
        }
    });

    app.get("/h:id", async function (req, res) {
        const id = req.params.id;
        const user_id = req.session.user_id
        if (!user_id) res.redirect("/");
        else {
            const ownUser = await Users.find({ id: user_id })
            const username = ownUser[0].username
            const messages = JSON.stringify(await Messages.find({}).limit(7));
            res.render("chat", { ownUsername: username, ownUserId: user_id, onLoadedMessages: messages });
        }
    })

    io.on("connection", async (socket) => {
        socket.on("message", async (message) => {
            const user = await Users.findOne({ username: message.username })
            message.user_id = user.id
            try {
                await Messages.create(message);
            } catch (e) {
                log("Message could not be created.")
                log(e)
            }
            socket.broadcast.emit("message", message);
        });
        socket.on("search", async (message) => {
            const users = await Users.find({ username: message }).limit(1)
            console.log(users)
            socket.emit("search", users)
        })
    });
};
