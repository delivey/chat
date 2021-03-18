const express = require("express");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
require("dotenv").config();
log = console.log;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const http = require("http").Server(app);
const port = 8080;
const io = require("socket.io")(http);

app.use(express.static(path.join(__dirname, "./../public")));
app.set("views", path.join(__dirname, "./../public/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    maxAge: Date.now() + 30 * 86400 * 1000,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

require("./api/user.js")(app);
require("./api/chat.js")(app, io);

http.listen(port, () => {
  console.log(`Chat listening at http://localhost:${port}`);
});
