const router = require('express').Router()
const postControllers = require('../controllers/postControllers')
const { verifyToken, verifyTokenAndAuthorization } = require('../utils/verifyToken')


router.post('/posts', verifyToken, postControllers.create)
router.get('/posts', verifyToken, postControllers.friendsPost )
router.put('/posts/:id', verifyToken, postControllers.update)
router.delete('/posts/:id', verifyToken, postControllers.delete)
router.get('/myPosts', verifyToken ,postControllers.myPosts)
router.get('/posts/:id', verifyToken, postControllers.userPosts)
router.get('/', verifyToken, postControllers.allPosts)
router.get('/tag', verifyToken, postControllers.tag)

module.exports = router