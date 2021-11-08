const express = require("express");
const path = require("path");
const session = require("express-session");
const sharedSession = require("express-socket.io-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")
require("dotenv").config();
log = console.log;

const mongoUrl = process.env.MONGO_URI

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = 8080;

app.use(express.static(path.join(__dirname, "./public")));
app.set("views", path.join(__dirname, "./public/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const normalSession = session({
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false },
	store: MongoStore.create({ mongoUrl: mongoUrl }),
})

app.use(normalSession);

io.use(sharedSession(normalSession, {
    autoSave:true
})); 

require("./api/user.js")(app);
require("./api/chat.js")(app, io);

http.listen(port, () => {
  console.log(`Chat listening at http://localhost:${port}`);
});
