module.exports = function (app) {
  app.get("/", async function (req, res) {
    req.session.username = "John"; // Uncomment this line to make the user register first
    let username = req.session.username;

    if (!username) res.render("index");
    else res.redirect("/chat");
  });

  app.get("/chat", async function (req, res) {
    res.render("chat");
  });

  app.post("/register", async function (req, res) {
    let username = req.body.username;
    req.session.username = username;
    res.redirect("/chat");
  });
};
