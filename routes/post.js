const router = require('express').Router()
const postControllers = require('../controllers/postControllers')
const { verifyToken, verifyTokenAndAuthorization } = require('../utils/verifyToken')


router.post('/addPost', verifyToken,postControllers.addPost)
router.post('/find', verifyToken, postControllers.friendsPost )
router.get('/all', postControllers.allPosts)

module.exports = router