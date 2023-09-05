const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    desc: {
        type: String,
        minlength: 5,
        required: true,
    },
 },
)
//test


module.exports = mongoose.model('Comment', CommentSchema)
