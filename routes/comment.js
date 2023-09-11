const router = require('express').Router()
const commentControllers = require('../controllers/commentControllers')
const { verifyToken, verifyTokenAndAuthorization } = require('../utils/verifyToken')


router.post('/comments/:postId', verifyToken, commentControllers.addComment)
router.delete('/comments/:id', verifyToken,commentControllers.deleteComment)
router.put('/comments/:id', verifyToken, commentControllers.updateComment)
router.get('/comments/:postId', commentControllers.getComment)


module.exports = router