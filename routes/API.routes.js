const router = require("express").Router();
const { apiController } = require("../controllers/index.js");
const { APImiddleware } = require("../middlewares/index");
router.get("/pet/all", apiController.getAll);
router
	.route("/pet")
	.get(apiController.getByType)
	.post(APImiddleware.jsonChecker, apiController.addPet);
router.get("/pet/adopt", apiController.getAvailables);
router.post("/pet/adopt/:id", apiController.adoptPet);
router.get("/pet/:type", apiController.getByType);

module.exports = router;
