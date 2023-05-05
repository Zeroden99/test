const User = require('../models/User');
const bcrypt = require('bcryptjs');
const createError = require('../utils/error');
const jwt = require('jsonwebtoken')

class authControllers{
    async regUser(req, res, next) {
        try {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password, salt)
            const newUser = new User({ ...req.body, password:hash })
            await newUser.save()
            res.status(200).json(newUser)
        } catch (e) {
            next(e)
        }
    }
    async loginUser(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) return next(createError(404, 'User Not Found'))
            const correctPassword = await bcrypt.compare(req.body.password, user.password)
            if(!correctPassword) return next(createError(400, 'Wrong Credentials'))
            const token = jwt.sign({ id: user._id, email:user.email }, process.env.SECRET_KEY)
            const { password, ...others } = user._doc
            res.status(200).json({others, token})
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new authControllers()