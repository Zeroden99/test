const router = require('express').Router()
const searchControllers = require('../controllers/searchControllers')
const { verifyToken } = require('../utils/verifyToken')
const { query } = require('express-validator')



router.get('/search', verifyToken, searchControllers.searchUser)
router.get('/ss', query('username')
.notEmpty()
.withMessage('isEmpty')
.isLength({min:3})
.withMessage('Min length is 3')
.isLength({max:18})
.withMessage('Max length is 18'), 
verifyToken, searchControllers.searchUsername)



module.exports = router