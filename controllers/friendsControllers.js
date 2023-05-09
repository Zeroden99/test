const User = require('../models/User');
const createError = require('../utils/error');

class friendsControllers {
    async addRequestFriends(req, res, next) {
        const { friendId } = req.body;
        const friend = await User.findById(friendId)
        if (!friend) {
            return next(createError(400, 'Invalid friend ID'))
        }
        const userId = req.user.id
        if (friendId === userId) {
            return next(createError(400, 'Cannot send request to yourself'))
        }
        const alreadySent = await User.findOne({
            _id: friendId,
            friendRequests: { $in: [userId] },
        });
        if (alreadySent) {
            return next(createError(400, 'Friend request already sent'))
        }
        const saveUser = await User.findByIdAndUpdate(
            friendId,
            { $push: { friendRequests: userId } },
            { new: true }
        );

        res.status(201).send(saveUser)
    }
    async friendAccepted(req, res, next) {
        const { friendId } = req.body
        const userId = req.user.id
        const friend = await User.findOneAndUpdate(
            {
                _id: userId,
                friendRequests: { $in: [friendId] },
            },
            {
                $pull: { friendRequests: friendId },
                $push: { friends: friendId },
            },
            { new: true }
        );
        if (!friend) {
            return next(createError(400, 'Invalid friend request'))
        }
        await User.findByIdAndUpdate(
            friendId,
            { $push: { friends: userId } },
            { new: true }
        );

        res.status(201).send(friend);
    }
    async friendRejected(req, res, next) {
        const { friendId } = req.body;
        const userId = req.user.id
        const friend = await User.findOneAndUpdate(
            {
                _id: userId,
                friendRequests: {
                    $in: [friendId]
                },
            },
            {
                $pull: { friendRequests: friendId },
            },
            { new: true }
        );
        if (!friend) {
            return next(createError(400, 'Invalid friend request'))
        }

        res.status(200).send(friend);
    }
}

module.exports = new friendsControllers()