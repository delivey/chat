module.exports = function (app, io) {
    app.get("/chat", async function (req, res) {
        let ownUsername = req.session.username;
        if (!ownUsername) {
            res.redirect("/");
        } else {
          res.render("chat", { ownUsername: ownUsername });
        }
    });

    io.on("connection", (socket) => {
        socket.on("message", (message) => {
            socket.broadcast.emit("message", message);
        });
    });
};
