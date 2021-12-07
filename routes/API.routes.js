const router = require('express').Router()
const { apiController } = require('../controllers/index.js')
const { APImiddleware } = require('../middlewares/index')
router.get('/pet/all', apiController.getAll)
router.get('/pet', apiController.getBySpecies)
router.post('/pet/add', APImiddleware.jsonChecker, apiController.addPet)
router.get('/adopt/pets', apiController.getAvailables)
router
  .route('/adopt/:id')
  .get(apiController.getPet)
  .post(APImiddleware.jsonChecker, apiController.adoptPet)
router.get('/pet/:species', apiController.getBySpecies)

module.exports = router
