const Friends = require('../models/Friends');
const createError = require('../utils/error');
const User = require('../models/User')

class friendsControllers {
    async addRequestFriends(req, res, next) {
       
        try {
            const userRequestId = req.user.id
            const userReceiveId = req.params.userReceiveId
            const userRequest = await User.findById(userRequestId);
            const userReceive = await User.findById(userReceiveId);
            if (userRequestId === userReceiveId) {
                return next(createError(400, 'Cannot send request to yourself'))
            }
            if (userReceiveId !== userReceive._id.toString()) {
                return res.status(404).json({ message: 'User not found' });
            }
            const alreadyReject = await Friends.findOneAndUpdate({
                $or: [{
                    userRequestId: userRequestId,
                    userReceiveId: userReceiveId,
                    status: 'rejected',
                }, {
                    userRequestId: userReceiveId,
                    userReceiveId: userRequestId,
                    status: 'rejected',
                }]
            }, {status: 'pending' },
            {new: true});
            if (alreadyReject) {
            await alreadyReject.save();
            }
            const alreadySent = await Friends.findOne({$or: [{
                userRequestId: userRequestId,
                userReceiveId: userReceiveId,
                status: 'pending',
            }, {
                userRequestId: userReceiveId,
                userReceiveId: userRequestId,
                status: 'pending',
            }]});
            if (alreadySent) {
                return next(createError(400, 'Friend request already sent'))
            }
            if (userReceiveId !== userReceive._id.toString()) {
                return res.status(404).json({ message: 'User not found' });
            }
            const alreadyFriends = await Friends.findOne({
                $or: [{
                    userRequestId: userRequestId,
                    userReceiveId: userReceiveId,
                    status: 'accepted',
                }, {
                    userRequestId: userReceiveId,
                    userReceiveId: userRequestId,
                    status: 'accepted',
                }]
            });
            if (alreadyFriends) {
                return next(createError(400, 'You already friends'))
            }
            const friendRequest = new Friends({
                userRequestId: userRequest._id,
                userReceiveId: userReceive._id,
            });

            await friendRequest.save();

            res.status(201).json({ message: 'Friend request sent' });
        } catch (error) {
            next(error);
        }

    }
    async friendAccepted(req, res, next) {
        try {
            const friendRequestId = req.params.friendRequestId;
            
            const alreadyFriends = await Friends.findOne({
                friendRequestId: friendRequestId,
                status: 'pending',
            });
            
            
            await Friends.findByIdAndUpdate(friendRequestId, { status: 'accepted' });

            res.status(200).json({ message: 'Friend request accepted' });
        } catch (error) {
            next(error);
        }

    }
    async friendRejected(req, res, next) {
        try {
            const friendRequestId = req.params.friendRequestId;
            const alreadyFriends = await Friends.findOne({
                friendRequestId: friendRequestId,
                status: 'pending',
            });
            if(alreadyFriends) {
                await alreadyFriends.deleteOne(friendRequestId);
            }

            res.status(200).json({ message: 'Friend request rejected' });
        } catch (error) {
            next(error);
        }
    }
    async friends(req, res, next) {
        try {
            const userRequestId = req.user.id
            const friends = await Friends.find({
                $or: [{
                    userRequestId: userRequestId,
                    status: 'accepted',
                }, {
                    userReceiveId: userRequestId,
                    status: 'accepted',
                }]
            })
                .populate('userRequestId', 'username')
            res.status(200).json(friends)
        } catch (e) {
            next(e)
        }        
    }
}

module.exports = new friendsControllers()