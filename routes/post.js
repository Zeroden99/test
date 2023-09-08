const router = require('express').Router()
const postControllers = require('../controllers/postControllers')
const { verifyToken, verifyTokenAndAuthorization } = require('../utils/verifyToken')


router.post('/posts', verifyToken,postControllers.addPost)
router.get('/posts', verifyToken, postControllers.friendsPost )
router.put('/posts', verifyToken, postControllers.updatePost)
router.delete('/posts/:id', verifyToken, postControllers.deletePost)
router.get('/myPosts', verifyToken ,postControllers.myPosts)
router.get('/posts/:id', verifyToken, postControllers.userPosts)
router.get('/', verifyToken, postControllers.allPosts)

module.exports = router