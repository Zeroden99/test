const router = require('express').Router()
const authControllers = require('../controllers/authControllers')


router.post('/signUp', authControllers.regUser)
router.post('/signIn', authControllers.loginUser)


module.exports = router