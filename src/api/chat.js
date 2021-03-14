module.exports = function (app, io) {
  app.get("/chat", async function (req, res) {
    let ownUsername = req.session.username;
    res.render("chat", { ownUsername: ownUsername });
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("message", (message) => {
      console.log("Received message");
      socket.broadcast.emit("message", message);
    });
  });
};
