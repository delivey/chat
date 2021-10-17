log = console.log

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
    
    if (form.addEventListener) { // Send message
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let messageContent = document.getElementById("message");
            if (messageContent.value !== "") {
                autoMessageScroller()
                const currentUrl = window.location.href.split("/")[3]
                var receiver_id;
                if (currentUrl != "chat") {
                    receiver_id = currentUrl.slice(1)
                } else {
                    receiver_id = "all"
                }

                let message = {
                    "content": messageContent.value,
                    "username": ownUsername,
                    "receiver_id": receiver_id
                }

                log(receiver_id)

                socket.emit("message", message)
                messageContent.value = "";
                showMessage(message);
            }
            messageContent.value = "";
        }
    )}

    function autoMessageScroller() {
        const messagesContainer = document.getElementById('messages');
        const messages = messagesContainer.getElementsByTagName('div')
        const messageCount = messages.length;
        const magicMessageNumber = 7
        console.log(messageCount)
        if (messageCount >= magicMessageNumber) {
            messagesContainer.removeChild(messages[0]); // Remove the child from queue that is the first li element. 
        }
    }

    function showOldMessages() {
        const old = JSON.parse(document.getElementById("onLoadedMessages").textContent)
        for (let i=0; i<old.length; ++i) {
            const oldMessage = old[i]
            showMessage(oldMessage)
        }
    }

    showOldMessages()

    socket.on("message", function (message) {
        autoMessageScroller()
        showMessage(message);
    });
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      afterPageLoad()
    }
  }