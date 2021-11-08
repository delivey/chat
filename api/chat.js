const { Messages } = require("../models/messages.js")
const { Users } = require("../models/users.js")
log = console.log

async function getSideChats(user_id) {
    const messageList = await Messages.find({
        $or: [
            { user_id: user_id },
            { receiver_id: user_id }
        ]
    }).sort({ field: "asc", _id: -1 }).limit(1)
    return messageList;
}

module.exports = function (app, io) {
    app.get("/chat", async function (req, res) {
        const user_id = req.session.user_id
        if (!user_id) res.redirect("/");
        else {
            const sideChats = await getSideChats(user_id);
            const ownUser = await Users.findOne({ id: user_id })
            const username = ownUser.username
            const messageList = await Messages.find({ receiver_id: "all" }).sort({ field: "asc", _id: -1 }).limit(7)
            const messages = JSON.stringify(messageList.reverse())
            res.render("chat", { 
                sideChats: sideChats, ownUsername: username,
                ownUserId: user_id, onLoadedMessages: messages 
            });
        }
    });

    app.get("/h:id", async function (req, res) {
        const id = req.params.id;
        const user_id = req.session.user_id
        if (!user_id) res.redirect("/");
        else {
            const sideChats = await getSideChats(user_id);
            const ownUser = await Users.findOne({ id: user_id })
            const username = ownUser.username
            const messageList = await Messages.find({
                $or: [
                    { receiver_id: id, user_id: user_id },
                    { receiver_id: user_id, user_id: id }
                ]
            }).sort({ field: "asc", _id: -1 }).limit(7)
            const messages = JSON.stringify(messageList.reverse())
            res.render("chat", { 
                sideChats: sideChats, ownUsername: username,
                ownUserId: user_id, onLoadedMessages: messages 
            });
        }
    })

    io.on("connection", async (socket) => {
        const user_id = socket.handshake.session.user_id
        socket.join(user_id) // Joins room for own id
        socket.on("message", async (message) => {
            message.user_id = user_id
            try {
                await Messages.create(message);
            } catch (e) {
                log("Message could not be created.")
                log(e)
            }
            if (message.receiver_id === "all") {
                socket.broadcast.emit("message", message);
            } else {
                socket.to(message.receiver_id).emit("message", message)
            }
        });
        socket.on("search", async (message) => {
            const users = await Users.find({ username: message }).limit(1)
            console.log(users)
            socket.emit("search", users)
        })
    });
};
