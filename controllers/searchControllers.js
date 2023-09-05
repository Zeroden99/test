const User = require('../models/User');
const createError = require('../utils/error');

class searchControllers{
    async searchUser(req, res, next) {
        try {
            const name = req.query.name
            const user = await User.find({ $or: [{ login: name }, {username: name}]})
            .select('login email username')
            if(user.length === 0) return next(createError(404, 'Not Found User'))
            res.status(200).json(user)
            
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new searchControllers()