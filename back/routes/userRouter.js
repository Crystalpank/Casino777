const router = require("express")()
const controller = require("../controller/userController")
const authMiddleware = require('../middleware/authMiddleware')

router.get("/getMoney", authMiddleware, controller.getMoney)

module.exports = router