const router = require('express').Router()
const friendsControllers = require('../controllers/friendsControllers')
const { verifyToken } = require('../utils/verifyToken')


router.post('/friendRequest/:userReceiveId', verifyToken, friendsControllers.addRequestFriends);
router.post('/acceptFriend/:friendRequestId', verifyToken, friendsControllers.friendAccepted);
router.post('/rejectFriend/:friendRequestId', verifyToken, friendsControllers.friendRejected);
router.get('/friends', verifyToken, friendsControllers.friends)


module.exports = router