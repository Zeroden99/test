const router = require('express').Router()
const commentControllers = require('../controllers/commentControllers')
const { verifyToken, verifyTokenAndAuthorization } = require('../utils/verifyToken')


router.post('/comment/:postId', verifyToken, commentControllers.addComment)
router.delete('/comment/:id', verifyToken,commentControllers.deleteComment)
router.get('/comment/:postId', commentControllers.getComment)


module.exports = router