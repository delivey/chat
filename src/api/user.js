const Users = require("../models/users.js").Users;

async function createId() {
    return Math.random().toString(36).substr(2, 9);
}

async function registerUser(username) {
    let id = await createId();
    let duplicateId = true;

    while (duplicateId) {
        let userWithSameId = await Users.findOne({ id: id }).exec();
        if (userWithSameId === null) duplicateId = false;
        else id = await createId();
    }
    await Users.create({ id: id, username: username });
}

module.exports = function (app) {
    app.get("/", async function (req, res) {
        let username = req.session.username;

        if (!username) res.render("index");
        else res.redirect("/chat");
    });

    app.post("/register", async function (req, res) {
        let username = req.body.username;

        let duplicate = await Users.findOne({ username: username }).exec();
        if (duplicate === null) {
            registerUser(username);
        }

        req.session.username = username;
        res.redirect("/chat");
    });
};
