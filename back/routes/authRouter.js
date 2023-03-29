const router = require('express')()
const controller = require('../controller/authController')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', [
    check('email', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть не менее 4 символов длиной").isLength({min: 4})
],
controller.registration)
router.post('/login', controller.login)

module.exports = router