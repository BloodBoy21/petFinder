const router = require("express").Router();

router.get("/", (req, res) => {
	res.send("Hello World!");
});

router.get("/admin", (req, res) => {
	res.render("admin");
});

module.exports = router;
