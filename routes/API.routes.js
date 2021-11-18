const router = require("express").Router();
const { apiController } = require("../controllers/index.js");
const { APImiddleware } = require("../middlewares/index");
router.get("/pet/all", apiController.getAll);
router
	.route("/pet")
	.get(apiController.getBySpecies)
	.post(APImiddleware.jsonChecker, apiController.addPet);
router.get("/pet/adopt", apiController.getAvailables);
router
	.route("/pet/adopt/:id")
	.get(apiController.getPet)
	.post(APImiddleware.jsonChecker, apiController.adoptPet);
router.get("/pet/:species", apiController.getBySpecies);

module.exports = router;
