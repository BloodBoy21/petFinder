const send = document.getElementById("send");
const messageHistory = document.getElementById("message-history");
// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "http://localhost:3000/images/user.png";
const PERSON_IMG = "http://localhost:3000/images/admin.png";
const CLIENT_NAME = "Client";
const PERSON_NAME = "You";
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
let ws;
if (ws) {
	ws.onerror = ws.onopen = ws.onclose = null;
	ws.close();
}

(async function () {
	const chatRoute = "ws://localhost:3000/admin";
	ws = new WebSocket(chatRoute);
	ws.onopen = (e) => {
		console.log("open");
	};
	ws.onmessage = (socket) => {
		console.log(socket.data);
		appendMessage(CLIENT_NAME, BOT_IMG, "left", socket.data);
	};
})();

msgerForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const msgText = msgerInput.value;
	if (!msgText) return;
	appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
	msgerInput.value = "";
	const data = { data: msgText };
	ws.send(JSON.stringify(data));
});

function appendMessage(name, img, side, text) {
	//   Simple solution for small apps
	const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

	msgerChat.insertAdjacentHTML("beforeend", msgHTML);
	msgerChat.scrollTop += 500;
}

// Utils
function get(selector, root = document) {
	return root.querySelector(selector);
}

function formatDate(date) {
	const h = "0" + date.getHours();
	const m = "0" + date.getMinutes();

	return `${h.slice(-2)}:${m.slice(-2)}`;
}
