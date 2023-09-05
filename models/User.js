const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 18,
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
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Email is not correct'
        }
    },
    password: {
        type: String,
        minlength: 6,
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