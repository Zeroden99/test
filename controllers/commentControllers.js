const Comment = require('../models/Comment');
const Post = require('../models/Post');
const createError = require('../utils/error');

class commentControllers {
    async addComment(req, res, next) {
        const newComment = new Comment({ ...req.body, userId: req.user.id, postId: req.params.postId })
        try {
            const savedComment = await newComment.save()
            await Post.updateOne({ _id: req.params.postId },
                {
                    $push: {comments: savedComment._id}
                })
            res.status(200).json(savedComment)
        } catch (e) {
            next(e)
        }
    }
    async deleteComment(req, res, next) {
        try {
            const comment = await Comment.findById(req.params.id)
            if (!comment) {
                return next(createError(404, 'Comment not found'));
            }
            const post = await Post.findById(comment.postId)
            if (!post) {
                return next(createError(404, 'Post not found'));
            }
            if (comment.userId.toString() == req.user.id || post.userId.toString() == req.user.id){
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
    async updateComment(req, res, next) {
        try {
            const comment = await Comment.findById(req.params.id)
            if (!comment) {
                return next(createError(404, 'Comment not found'));
            }
            const post = await Post.findById(comment.postId)
            if (!post) {
                return next(createError(404, 'Post not found'));
            }
            if (comment.userId.toString() == req.user.id || post.userId.toString() == req.user.id) {
                const updateComm = await Comment.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                }, 
                {new: true}
                )
                res.status(200).json(updateComm)
            } else {
                return next(createError(403, 'You can update only your comment'))
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