const router = require('express').Router()
const friendsControllers = require('../controllers/friendsControllers')
const { verifyToken } = require('../utils/verifyToken')


router.post('/friendRequest', verifyToken, friendsControllers.addRequestFriends);
router.post('/acceptFriend', verifyToken, friendsControllers.friendAccepted);
router.post('/rejectFriend', verifyToken, friendsControllers.friendRejected);
router.get('/friends', verifyToken, friendsControllers.friends)


module.exports = router