var socket = io()

function search() {
    const searchField = document.getElementById("search").value
    socket.emit("search", searchField)
}

console.log("loaded")
socket.on("search", function (users) {
    if (users.length !== 0) {
        const user = users[0]
        console.log(user.username)
        const sidebar = document.getElementById("sidebar")

        var found = document.createElement("div")
        found.setAttribute("class", "found chat-container")
        var text = document.createTextNode(user.username);
        found.appendChild(text)
        sidebar.insertBefore(found, sidebar.children[2]);
    }
});
