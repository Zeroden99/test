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
            const alreadySent = await Friends.findOne({$or: [
                { userRequestId: userRequestId, userReceiveId: userReceiveId, }, 
            { userRequestId: userReceiveId, userReceiveId: userRequestId, }
        ]});
            if (alreadySent && alreadySent.status === 'pending') {
                return next(createError(400, 'Friend request already sent'))
            }
            if (alreadySent && alreadySent.status === 'accepted') {
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
            const userRequestId = req.user.id
            const userReceiveId = req.params.userReceiveId
            const alreadySent = await Friends.findOne({
                $or: [
                    { userRequestId: userRequestId, userReceiveId: userReceiveId, },
                    { userRequestId: userReceiveId, userReceiveId: userRequestId, }
                ]
            });
            if(!alreadySent) {
                return next(createError(400, 'You do not have this request'))
            }
            if(alreadySent && alreadySent.status == 'accepted') {
                return next(createError(400, 'You already friends'))

            }
            alreadySent.status = 'accepted'
            await alreadySent.save()
            res.status(200).json({ message: 'Friend request accepted' });
        } catch (error) {
            next(error);
        }

    }
    async friendRejected(req, res, next) {
        try {
            const userRequestId = req.user.id
            const userReceiveId = req.params.userReceiveId
            const alreadySent = await Friends.findOne({
                $or: [
                    { userRequestId: userRequestId, userReceiveId: userReceiveId, },
                    { userRequestId: userReceiveId, userReceiveId: userRequestId, }
                ]
            });
            if (!alreadySent) {
                return next(createError(400, 'You do not have this request'))
            }
            if (alreadySent && alreadySent.status == 'accepted') {
                return next(createError(400, 'You already friends'))

            }
            await alreadySent.deleteOne()
            res.status(200).json({ message: 'Friend request rejected' });
        } catch (error) {
            next(error);
        }
    }
    async friends(req, res, next) {
        const userRequestId = req.user.id
        const page = parseInt(req.query.page) || 1
        const perPage = 3
        try {
            
            const friends = await Friends.find({$or: [{
                    userRequestId,
                    status: 'accepted',
                }, {
                    userReceiveId: userRequestId,
                    status: 'accepted',
                }]
            })
                .skip((page-1) * perPage)
                .limit(perPage)
                .populate('userRequestId', 'username') 
                .populate('userReceiveId', 'username') 
                .select('userRequestId userReceiveId');
                
            res.status(200).json(friends)
        } catch (e) {
            next(e)
        }        
    }
}

module.exports = new friendsControllers()