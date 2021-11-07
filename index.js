const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const apiRouter = require("./routes/API.routes");
const chatRouter = require("./routes/chat.routes");
const server = require("http").Server(app);
//WebSocket server
const webSocket = require("ws").Server;
const chatSocket = new webSocket({ server, path: "/ws" });
const chat = require("./chat");
chatSocket.on("connection", chat.connection);

//Serve middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", apiRouter);
app.use("/ws", chatRouter);
app.use("/static", express.static(__dirname + "/public"));
//Set view engine
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("express-es6-template-engine"));
app.set("view engine", "html");

server.listen(3000, () => {
	console.log("server started on port 3000");
});
