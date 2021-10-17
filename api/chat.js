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
            const messages = JSON.stringify(await Messages.find({}).limit(7));
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
            await Messages.create(message);
            socket.broadcast.emit("message", message);
        });
        socket.on("search", async (message) => {
            const users = await Users.find({ username: message }).limit(1)
            console.log(users)
            socket.emit("search", users)
        })
    });
};
