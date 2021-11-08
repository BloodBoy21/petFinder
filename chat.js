class Observable {
	constructor() {
		this.clients = [];
	}
	atttach(observer) {
		this.clients.push(observer);
	}
	detach(observer) {
		this.clients = this.clients.filter((client) => client !== observer);
	}
	notify(data) {
		this.clients.forEach((client) => client.update(data));
	}
}
class Observer {
	constructor(ws, observable) {
		this.observable = observable;
		this.observable.atttach(this);
		this.ws = ws;
	}

	detach() {
		this.observable.detach(this);
	}
	connection(client) {
		this.client = client;
		this._enableChat();
		this._onClose();
	}
	_enableChat() {
		//Incoming messages send to client
		this.ws.on("message", (message) => {
			console.log("Client:", message.toString());
			this.sendToClient(message);
		});
	}
	_onClose() {
		this.ws.on("close", () => {
			console.log("Client disconnected");
			this.detach();
		});
	}
	sendToClient(message) {
		try {
			message = JSON.parse(message.toString());
			this.client._send(message.data);
		} catch (e) {
			console.log("Error:", e);
		}
	}
	_send(message) {
		this.ws.send(message);
	}
}
class ClientCenter extends Observable {
	constructor(wss, adminCenter) {
		console.log("ClientCenter");
		super();
		this.wss = wss;
		this.adminCenter = adminCenter;
	}
	run(ws) {
		ws.send("Welcome to chat");
		const client = new Observer(ws, this);
		this.clients.push(client);
		this.adminCenter.stablishConnection(client);
	}
	detach(observable) {
		if (observable.client instanceof Admin) {
			this.adminCenter.disconnect(observable.client);
		}
		this.clients = this.clients.filter((client) => client !== observable);
	}
}
class AdminCenter extends Observable {
	constructor(wss) {
		console.log("AdminCenter");
		super();
		this.wss = wss;
		this.waitlist = [];
		this.availables = [];
	}
	run(ws) {
		ws.send("Welcome to chat Admin center");
		const admin = new Admin(ws, this);
		this.clients.push(admin);
		this.availables.push(admin);
		this._checkWaitlist();
	}
	_checkWaitlist() {
		if (this.waitlist.length > 0) {
			this.stablishConnection(this.waitlist.shift());
		}
	}
	stablishConnection(newClient) {
		if (this.availables.length > 0) {
			const admin = this.availables.shift();
			admin.connection(newClient);
			newClient.connection(admin);
		} else {
			this.waitlist.push(newClient);
		}
	}
	disconnect(admin) {
		this.availables.push(admin);
		admin.client = null;
		if (this.waitlist.length > 0) {
			this.stablishConnection(this.waitlist.shift());
		}
	}
	detach(admin) {
		console.log("Admin disconnected");
		if (admin.client instanceof Observer) {
			this.stablishConnection(admin.client);
		}
		this.clients = this.clients.filter((client) => client !== admin);
		this.availables = this.availables.filter((client) => client !== admin);
	}
}

class Admin extends Observer {
	constructor(ws, observable) {
		super(ws, observable);
	}
	_enableChat() {
		//Admin page to admin server
		this.ws.on("message", (message) => {
			console.log("Admin:", message.toString());
			if (message.action === "close") {
				this.client.detach();
			} else {
				this.sendToClient(message);
			}
		});
	}
}
module.exports = {
	ClientCenter,
	AdminCenter,
};
