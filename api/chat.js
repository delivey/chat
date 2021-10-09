const { Messages } = require("../models/messages.js")

module.exports = function (app, io) {
    app.get("/chat", async function (req, res) {
        const ownUsername = req.session.username;
        if (!ownUsername) res.redirect("/");
        else {
            const messages = JSON.stringify(await Messages.find({}).limit(7));
            res.render("chat", { ownUsername: ownUsername, onLoadedMessages: messages });
        }
    });

    io.on("connection", async (socket) => {
        socket.on("message", async (message) => {
            await Messages.create(message);
            socket.broadcast.emit("message", message);
        });
    });
};
