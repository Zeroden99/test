const Post = require('../models/Post');
const User = require('../models/User');
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

            // знаходимо всіх друзів користувача
            const user = await User.findById(userId);
            const friends = user.friends

            // // знаходимо всі пости друзів з пагінацією
            const pageSize = 3; // кількість постів на одній сторінці
            const currentPage = parseInt(req.query.page) || 1; // поточна сторінка (якщо не вказана, то 1)

            const friendPosts = await Post.find({ userId: { $in: friends } })
                .skip((currentPage - 1) * pageSize) // пропускаємо кількість постів, щоб показати поточну сторінку
                .limit(pageSize); // обмежуємо кількість постів на одній сторінці

            res.send(friendPosts);     
        } catch (e) {
            next(e)
        }
    }
   
}

module.exports = new postControllers()
