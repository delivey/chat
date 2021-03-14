module.exports = function (app, io) {
  app.get("/chat", async function (req, res) {
    res.render("chat");
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("message", (message) => {
      console.log("Received message");
      socket.emit("message", message);
    });
  });
};
