const mongoose = require('mongoose');

const FriendsSchema = new mongoose.Schema({
    userRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userReceiveId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
}, {timestamps: true })

module.exports = mongoose.model('Friends', FriendsSchema)