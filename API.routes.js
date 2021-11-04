const router = require("express").Router();
const { apiController } = require("./controllers/index");
router.get("/allPets", apiController.getAll);
router.route("/pet").get(apiController.getByType).post(apiController.addPet);
router.get("/pet/:type", apiController.getByType);
router.get("/availables", apiController.getAvailables);
router.post("/pet/adopt/:id", apiController.adoptPet);
module.exports = router;
