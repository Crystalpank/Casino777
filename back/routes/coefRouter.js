const router = require('express')()
const controller = require('../controller/coefsController')
const authMiddleware = require('../middleware/authMiddleware')


router.get('/getPreviousCoefs', authMiddleware, controller.getCoefs)

module.exports = router