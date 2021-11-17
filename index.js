const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const apiRouter = require("./routes/API.routes");
const rootRouter = require("./routes/root.routes");
const server = require("http").Server(app);
const db = require("./db");
const { PORT, NODE_ENV } = require("./config/index");
//Serve middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//Routes
app.use("/", rootRouter);
app.use("/api", apiRouter);
//Set view engine
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("express-es6-template-engine"));
app.set("view engine", "html");

server.listen(PORT, () => {
	console.log(`server started on port ${PORT} in ${NODE_ENV}`);
});
