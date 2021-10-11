const { Messages } = require("../models/messages.js")
const { Users } = require("../models/users.js")

module.exports = function (app, io) {
    app.get("/chat", async function (req, res) {
        const ownUsername = req.session.username;
        if (!ownUsername) res.redirect("/");
        else {
            const messages = JSON.stringify(await Messages.find({}).limit(7));
            res.render("chat", { ownUsername: ownUsername, onLoadedMessages: messages });
        }
    });

    app.get("/h:id", async function (req, res) {
        const id = req.params.id;
        const ownUsername = req.session.username;
        if (!ownUsername) res.redirect("/");
        else {
            const messages = JSON.stringify(await Messages.find({}).limit(7));
            res.render("chat", { ownUsername: ownUsername, onLoadedMessages: messages });
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
