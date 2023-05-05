const User = require('../models/User');

class searchControllers{
    async searchUser(req, res, next) {
        try {
            const user = await User.find({ $or:[{login: req.body.login}, {username: req.body.username}]})
            res.status(200).json(user)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new searchControllers()