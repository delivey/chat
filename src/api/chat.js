module.exports = function (app, io) {

    app.get("/chat", async function (req, res) {
        res.render("chat");
    });

    io.on('connection', (socket) => {
        console.log('a user connected');
    });

};
