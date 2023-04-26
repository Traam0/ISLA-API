const router = require('express').Router()
const challengeController = require('../controllers/challengeController')
const authenticationMiddlware = require("../middlewares/validation");

router.get('/', authenticationMiddlware.validateAccessToken, challengeController.getAll)
router.post('/new', authenticationMiddlware.adminOnly, challengeController.addChallenge)

module.exports = router