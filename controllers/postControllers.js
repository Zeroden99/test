const Post = require('../models/Post');
const User = require('../models/User');
const Friend = require('../models/Friend'); 
const Comment = require('../models/Comment')
const createError = require('../utils/error');

class postControllers {
    async create(req, res, next) {
        const tag = req.body.tags
        const tagSplit = tag.split(' ')
        const { title, desc } = req.body
        const formHashtags = tagSplit.map(hashtag => {
            if (!hashtag.startsWith('#')) {
                return `#${hashtag}`
            }
            return hashtag;
        });
        // const newPost = new Post({ userId: req.user.id, tags: tagSplit, ...req.body })
        try {
            const newPost = new Post({
                userId: req.user.id,
                title,
                desc,
                tags: formHashtags, 
            });
            const savePost = await newPost.save()
            res.status(200).json(savePost)
        } catch (e) {
            next(e)
        }
    }
    async update(req, res, next) {
        try {
            const tag = req.body.tags
            const tagSplit = tag.split(' ')
            const { title, desc } = req.body
            const formHashtags = tagSplit.map(hashtag => {
                if (!hashtag.startsWith('#')) {
                    return `#${hashtag}`
                }
                return hashtag
            });
        const post = await Post.findById(req.params.id)
        if (!post) {
            createError(404, 'Post not found')
        }
        if (post.userId.toString() == req.user.id) {
            const updatePost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: {
                        title: req.body.title,
                        desc: req.body.desc,
                        tags: formHashtags
                    }
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
    async delete(req, res, next) {
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
            const pageSize = 3;
            const currentPage = parseInt(req.query.page) || 1;
            const friends = await Friend.find({
                $or: [
                    { userRequestId: userId, status: 'accepted' },
                    { userReceiveId: userId, status: 'accepted' }
                ]
            });
            const friendUserIds = friends.map(friend => {
                return friend.userRequestId == userId ? friend.userReceiveId : friend.userRequestId;
            });
            const friendPosts = await Post.find({
                userId: { $in: friendUserIds }})
                .skip((currentPage - 1) * pageSize)
                .limit(pageSize);
            res.status(200).json(friendPosts)
        } catch (e) {
            next(e)
        }
    }
    async myPosts(req, res, next) {
        const user = await User.findById(req.user.id)
        const posts = await Post.find({userId: user.id})
        res.send(posts)
    }
    async userPosts(req, res, next) {
        const user = await User.findById(req.params.id)
        const posts = await Post.find({ userId: user.id })
        res.send(posts)
    }
    async allPosts(req, res, next) {
        const userId = req.user.id
        const pageSize = 3
        const currentPage = req.query.page || 1
        try {
            const friends = await Friend.find({
                $or: [
                    { userRequestId: userId, status: 'accepted' },
                    { userReceiveId: userId, status: 'accepted' }
                ]
            })
            const friendUserIds = friends.map(friend => {
                return friend.userRequestId == userId ? friend.userReceiveId : friend.userRequestId;
            });
            friendUserIds.push(userId);
            const friendPosts = await Post.find({
                userId: { $in: friendUserIds }
            })
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize)
            
            res.status(200).json(friendPosts)
        } catch (e) {
            next(e)
        }
    }
    async tag(req, res, next) {
        const tags = req.query.tag
        const search = tags.map(tag => {
            if (!tag.startsWith('#')) {
                tag = `#${tag}`
            }
            return { tags: tag }
        });
        try {
            const posts = await Post.find({ $and: search })
            res.status(200).json(posts)
        } catch (e) {
            next(e)
        }
    }
}
module.exports = new postControllers()
