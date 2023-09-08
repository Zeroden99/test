const router = require('express').Router()
const friendsControllers = require('../controllers/friendsControllers')
const { verifyToken } = require('../utils/verifyToken')


router.post('/friendRequest/:userReceiveId', verifyToken, friendsControllers.addRequestFriends);
router.post('/acceptFriend/:userReceiveId', verifyToken, friendsControllers.friendAccepted);
router.post('/rejectFriend/:userReceiveId', verifyToken, friendsControllers.friendRejected);
router.get('/friends', verifyToken, friendsControllers.friends)
router.get('/searchFriends', verifyToken, friendsControllers.searchFriends)
router.get('/request', verifyToken, friendsControllers.friendsRequest)


module.exports = router