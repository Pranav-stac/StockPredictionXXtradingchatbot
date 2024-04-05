class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "Enqu", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Enqu")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}


const chatbox = new Chatbox();
chatbox.display();
// const chatInput = document.getElementById("chat-input");
// const chatForm = document.getElementById("chat-form");
// const chatbotFigure = document.querySelector('.mobile')

// let apiURL = ''

// function toggleChatBot() {
//     chatbotFigure.classList.toggle('hidden')
// }
// chatForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     let userMsg = chatInput.value
//     addMessage(userMsg, 'outgoing');

//     fetch('http://127.0.0.1:5000/chatbot_api/${apiURL}', {
//         method: "POST",
//         body: JSON.stringify({ "message": userMsg }),
//         mode: "cors",
//         headers: { "Content-Type": "application/json" }
//     }).then(r => r.json()).then(r => {
//         if (r.url) {
//             apiURL = r.url
//         } else {
//             apiURL = ''
//         }
//         addMessage(r.response, 'incoming');

//         if (r.data) {
//             addPDFBtn(r.data)
//         }
//     })

// });

// function addMessage(message, msgtype) {
//     const chatMessage = document.createElement("div");
//     chatMessage.classList.add("chat-message");
//     chatMessage.classList.add(`${msgtype}-message`);
//     chatMessage.innerText = message;
//     document.querySelector(".chat-messages").appendChild(chatMessage);
//     document.querySelector(".chat-messages").scrollTop +=
//         chatMessage.getBoundingClientRect().y + 20;
//     chatInput.value = "";
// }

// function addPDFBtn(data) {
//     const chatMessage = document.createElement("div");
//     chatMessage.classList.add("chat-message");
//     chatMessage.classList.add(`incoming-message`);
//     chatMessage.classList.add(`file-message`);
//     chatMessage.innerText = data.filename;
//     console.log(data.link)
//     chatMessage.onclick = (e) => {
//         window.open(data.link)
//     }
//     document.querySelector(".chat-messages").appendChild(chatMessage);
//     document.querySelector(".chat-messages").scrollTop +=
//         chatMessage.getBoundingClientRect().y + 10;
//     chatInput.value = "";
// }
