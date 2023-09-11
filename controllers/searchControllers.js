const User = require('../models/User');
const createError = require('../utils/error');
const { validationResult } = require('express-validator');


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
    async searchUsername(req, res, next) {
        const result = validationResult(req)
        if (result.isEmpty()){
        try {
            const user = await User.find({ username: req.query.username })
            .select('login email username')
            if (user.length === 0) return next(createError(404, 'Not Found User'))
            res.status(200).json(user)

        } catch (e) {
            next(e)
        }
        } 
        else { res.send({ errors: result.array() }) }
    }
}

module.exports = new searchControllers()