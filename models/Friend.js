const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({
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
        enum: ['pending', 'accepted'],
        default: 'pending',
    },
}, {timestamps: true })

module.exports = mongoose.model('Friend', FriendSchema)