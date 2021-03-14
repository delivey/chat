const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();
const http = require('http').Server(app);
const port = 8080;
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, "./../public")));
app.set("views", path.join(__dirname, "./../public/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    maxAge: Date.now() + 30 * 86400 * 1000,
    resave: true,
    saveUninitialized: false,
    cookie: {},
  })
);

require("./api/user.js")(app);
require("./api/chat.js")(app, io);

http.listen(port, () => {
  console.log(`Chat listening at http://localhost:${port}`);
});
