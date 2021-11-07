exports.connection = async function (ws) {
	this.ws = ws;
	console.log("New connection");
	ws.send("You are now connected");
	ws.on("message", async function (data_) {
		data["ws"] = this.ws;
		const data = JSON.parse(data_);
		console.log(data);
		actions(data.action, data);
	});
	ws.on("close", function () {
		console.log("Connection closed");
	});
};
//TODO: Add functions to update the chat
function actions(action, data) {
	switch (action) {
		case "update":
			update(data);
			break;
		case "delete":
			delete_message(data);
			break;
		case "send":
			send_message(data);
			break;
	}
}
function update(data) {
	console.log("Updating");
	console.log(data);
}
