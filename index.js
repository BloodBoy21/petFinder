const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const apiRouter = require("./routes/API.routes");
const chatRouter = require("./routes/chat.routes");
const rootRouter = require("./routes/root.routes");
const server = require("http").Server(app);
const { PORT, NODE_ENV } = require("./config/index");
//WebSocket server
const webSocket = require("ws").Server;
const chatSocket = new webSocket({ noServer: true });
const chatAdmin = new webSocket({ noServer: true });
const { AdminCenter, ClientCenter } = require("./chat");
const adminCenter = new AdminCenter(chatAdmin);
const clientCenter = new ClientCenter(chatSocket, adminCenter);
// adminCenter.run();
chatSocket.on("connection", (ws) => {
	clientCenter.run(ws);
});
chatAdmin.on("connection", (ws) => {
	adminCenter.run(ws);
});

//Serve middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/static", express.static(__dirname + "/public"));
//Routes
app.use("/", rootRouter);
app.use("/api", apiRouter);
app.use("/ws", chatRouter);
//Set view engine
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("express-es6-template-engine"));
app.set("view engine", "html");

server.listen(PORT, () => {
	console.log(`server started on port ${PORT} in ${NODE_ENV}`);
});

server.on("upgrade", (req, socket, head) => {
	console.log("upgrade");
	console.log("handle upgrade");
	const selectWSS = {
		"/ws": chatSocket,
		"/admin": chatAdmin,
	}[req.url];
	if (selectWSS) {
		selectWSS.handleUpgrade(req, socket, head, (socket) => {
			selectWSS.emit("connection", socket, req);
		});
	} else {
		socket.destroy();
	}
});
