function afterPageLoad() {
    let form = document.getElementById("send");
    var ownUsername = document.getElementById("ownUsername").value
    
    var socket = io();
    
    function showMessage(message) {
    
        let newMessage = document.createElement("div")
        let messageSide = ownUsername == message.username ? "right" : "left";
    
        newMessage.className = `message ${messageSide}`
    
        let messages = document.getElementsByClassName("messages")[0]
        messages.appendChild(newMessage);
    
        let newMsgUsername = document.createElement("p")
        let newMsgContent = document.createElement("p");
    
        newMsgUsername.innerHTML = message.username;
        newMsgUsername.className = "username"
    
        newMsgContent.innerHTML = message.content;
        newMsgContent.className = "message-content";
    
        newMessage.append(newMsgUsername);
        newMessage.append(newMsgContent);
    
    }
    
    if (form.addEventListener) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let messageContent = document.getElementById("message").value;
            if (messageContent !== "") {
                let message = {
                    "content": messageContent,
                    "username": ownUsername
                }
                socket.emit("message", message)
                messageContent.value = "";
                showMessage(message);
            }
            messageContent.value = "";
        }
    )}

    function showOldMessages() {
        const old = JSON.parse(document.getElementById("onLoadedMessages").textContent)
        for (let i=0; i<old.length; ++i) {
            const oldMessage = old[i]
            showMessage(oldMessage)
        }
    }

    showOldMessages()

    socket.on("message", function (message) {
        showMessage(message);
    });
}