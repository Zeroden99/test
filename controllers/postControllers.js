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
    async friendsPost(req, res, next) {
        try {
            const userId = req.user.id
            const user = await User.findById(userId);
            const friends = user.friends
            const pageSize = 3;
            const currentPage = parseInt(req.query.page) || 1;
            const friendPosts = await Post.find({ userId: { $in: friends } })
                .populate('comments')
                .skip((currentPage - 1) * pageSize)
                .limit(pageSize);
           
            res.send(friendPosts);
        } catch (e) {
            next(e)
        }
    }
    async allPosts(req, res, next) {
        const Posts = await Post.find({})
        .populate('comments')
        res.send(Posts)
    }
   
}

module.exports = new postControllers()
