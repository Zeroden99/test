const Comment = require('../models/Comment');
const Post = require('../models/Post');
const createError = require('../utils/error');

class commentControllers {
    async addComment(req, res, next) {
        const newComment = new Comment({...req.body, userId: req.user.id})
        try {
            const savedComment = await newComment.save()
            res.status(200).json(savedComment)
        } catch (e) {
            next(e)
        }
    }
    async deleteComment(req, res, next) {
        try {
            const comment = await Comment.findById(req.params.id)
            const post = await Post.findById(req.params.id)
            if(req.user.id === comment.userId || req.user.id === post.userId){
                await Comment.findByIdAndDelete(req.params.id)
                res.status(200).json('Comment has been deleted')
            }
            else {
                return next(createError(403, 'You can delete only your comment'))  
            } 
        } catch (e) {
            next(e)
        }
    }
    async getComment(req, res, next) {
        try {
            const comments = await Comment.find({ postId: req.params.postId })
            res.status(200).json(comments)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new commentControllers()