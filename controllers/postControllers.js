const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment')
const createError = require('../utils/error');

class postControllers {
    async addPost(req, res, next) {
        const newPost = new Post({ userId: req.user.id, ...req.body })
        try {
            const savePost = await newPost.save()
            res.status(200).json(savePost)
        } catch (e) {
            next(e)
        }
    }
    async updatePost(req, res, next) {
        try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            createError(404, 'Post not found')
        }
        if (post.userId.toString() == req.user.id) {
            const updatePost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                },
                    { new: true }
                )
            res.status(200).json(updatePost)
        } else {
            return next(createError(403, 'You can update only your post'))  
        } 
        } catch (e) {
            next(e)
        }
    }
    async deletePost(req, res, next) {
        try {
            const post = await Post.findById(req.params.id)
            if (!post) {
                createError(404, 'Post not found')
            }
            if (post.userId.toString() == req.user.id) {
                const updatePost = await Post.findByIdAndDelete(req.params.id)
                res.status(200).json('Post Deleted')
            } else {
                return next(createError(403, 'You can Delete only your post'))
            }
        } catch (e) {
            next(e)
        }
    }
    async friendsPost(req, res, next) {
        try {
            const userId = req.user.id
            const user = await User.findById(userId);
            const friends = user.friends
            const pageSize = 3;
            const currentPage = parseInt(req.query.page) || 1;
            const friendPosts = await Post.find({ userId: { $in: friends } })
                .skip((currentPage - 1) * pageSize)
                .limit(pageSize);
           
            res.send(friendPosts);
        } catch (e) {
            next(e)
        }
    }
    async allPosts(req, res, next) {
        const user = await User.findById(req.user.id)
        const posts = await Post.find({userId: user.id})
        res.send(posts)
    }
   
}

module.exports = new postControllers()
