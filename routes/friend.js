const router = require('express').Router()
const friendsControllers = require('../controllers/friendsControllers')
const { verifyToken, verifyTokenAndAuthorization } = require('../utils/verifyToken')


router.post('/friendRequest', verifyToken, friendsControllers.addRequestFriends);
router.post('/acceptFriend', verifyToken, friendsControllers.friendAccepted);
router.post('/rejectFriend', verifyToken, friendsControllers.friendRejected);


module.exports = router