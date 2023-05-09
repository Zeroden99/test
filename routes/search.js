const router = require('express').Router()
const searchControllers = require('../controllers/searchControllers')
const { verifyToken } = require('../utils/verifyToken')


router.post('/search', verifyToken, searchControllers.searchUser)
router.post('/ss', )



module.exports = router