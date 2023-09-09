const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Тип поля - ObjectId
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        minlength: 3,
        maxlength: 18,
        required: true,
    },
    desc: {
        type: String,
        minlength: 10,
        required: true,
    },
    tags: [
        String
    ],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
},
)


module.exports = mongoose.model('Post', PostSchema)
