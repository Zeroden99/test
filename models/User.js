const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
    },
    login: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
       
    },
    isGoogleUser: {
      type: Boolean,
      default: false
    }, 
    isFacebookUser: {
        type: Boolean,
        default: false
    },
    friendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    
}, { timestamps:true })

module.exports = mongoose.model('User', UserSchema)