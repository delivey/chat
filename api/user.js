const { Users } = require("../models/users.js")
log = console.log

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
    await Users.create({ id: id.toString(), username: username });
    return id
}

module.exports = function (app) {
    app.get("/", async function (req, res) {
        const user_id = req.session.user_id;
        if (!user_id) res.render("index");
        else res.redirect("/chat");
    });

    app.post("/register", async function (req, res) {
        const username = req.body.username;
        const duplicate = await Users.findOne({ username: username }).exec();
        if (duplicate === null) {
            const user_id = await registerUser(username);
            req.session.user_id = user_id;
        } else {
            res.send("DUPLICATE USERNAME")
        }
        res.redirect("/chat");
    });
};
